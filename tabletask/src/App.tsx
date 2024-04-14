import { useEffect, useState, useRef } from 'react';
import './App.sass';
import { api } from './api/api';
import { Post } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Column } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Col, Row } from 'react-bootstrap';
import { DeleteModal } from './components/DeleteModal';
import { AddModal } from './components/AddModal';

// Под Redux тут нет места, так как весь стейт хранится на сервере, но мое
// пользование им и серверной частью можно посмотреть тут: https://github.com/LavrCheck/Dairy



function App() {

  const [isShowDeleteModal, setIsShowDeleteModal] = useState<boolean>(false)
  const [deletingId, setDeletingId] = useState<string>('')

  const [isShowAddModal, setIsShowAddModal] = useState<boolean>(false)  // Управление модальными окнами
  const [dataModal, setDataModal] = useState<Post | null>(null)



  const [rows, setRows] = useState<Post[]>([])  // Строки таблицы

  const loadFirst = async (): Promise<void> => {
    try {
      const resp: Post[] = await api.getPosts(0)  // Первоначальная загрузка
      setRows(resp)
    } catch (e) {
      console.log(e)
      // В обработчиках можно выводить форматированную в апи или фронте ошибку в уведомлении,
      // показывать изменениями UI и т.д., все зависит от того, насколько ошибка ожидаемая и какой выбран подход
      // их обработки,  тут впредь блок try\catch я не буду использовать, смысл понятен)
    }
  }

  useEffect(() => {
    loadFirst()
  }, [])



  const [start, setStart] = useState<number>(20)

  const loadMore = async (): Promise<void> => {
    const resp: Post[] = await api.getPosts(start)
    setRows(prev => [...prev, ...resp])
    setLock(false)
  }

  useEffect(() => {
    loadMore()
  }, [start])


  const [lock, setLock] = useState(false)

  useEffect(() => {
    const handleScroll = async () => {
      if (lock) { return }

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;   // Infinite scroll
      if (scrollHeight - scrollTop - clientHeight < 200) {
        setLock(true)
        setStart(prev => prev + 20)
      }
    };

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    };
  }, [lock])


  const columns: Column[] = [
    { name: 'title', title: 'Заголовок' },
    { name: 'client', title: 'Клиент' },
    { name: 'product', title: 'Продукт' },
    { name: 'IBAN', title: 'IBAN' },
    { name: 'article', title: 'Артикул', },
    {
      name: 'actions', title: 'Действия', getCellValue: (row: Post) => (
        <Col className='d-flex justify-content-around'>
          <FontAwesomeIcon onClick={() => { setDeletingId(row.id); setIsShowDeleteModal(true) }}
            cursor={'pointer'} size='lg' icon={faTrash} />
          <FontAwesomeIcon onClick={() => { setDataModal(row); setIsShowAddModal(true) }}
            cursor={'pointer'} size='lg' icon={faPencil} />
        </Col>
      )
    }
  ]

  const tableColumnExtensions: Table.ColumnExtension[] = [
    { columnName: 'actions', align: 'center' },
    { columnName: 'IBAN', width: 300, wordWrapEnabled: true },
    {columnName: 'client', wordWrapEnabled: true}
  ]

  const onDelete = async (): Promise<void> => {
    await api.deletePost(deletingId)
    setRows(prev => prev.filter(x => x.id !== deletingId))
    setIsShowDeleteModal(false)
  }

  const onAdd = async (p: Post): Promise<void> => {
    const resp: Post = await api.addPost(p)
    setRows(prev => [...prev, resp])
    setIsShowAddModal(false)
  }

  const onEdit = async (p: Post): Promise<void> => {
    const resp: Post = await api.editPost(p)
    setRows(prev => prev.map(x => {
      if (x.id === resp.id) { return resp }
      return x
    }))
    setIsShowAddModal(false)
    setDataModal(null)
  }



  return <>
    <div className="App">
      <Row className='m-0 p-0 justify-content-center'>
        <Col xxl={8} xl={12}  className='content'>
          <Grid
            rows={rows}
            columns={columns}
          >
            <Table columnExtensions={tableColumnExtensions} />
            <TableHeaderRow />
          </Grid>
          <Button onClick={() => { setDataModal(null); setIsShowAddModal(true) }} variant='success' className='add-button'>Добавить</Button>
        </Col>
      </Row>
    </div>

    <DeleteModal
      isShowModal={isShowDeleteModal}
      onHide={() => setIsShowDeleteModal(false)}
      onDelete={() => onDelete()}
    />
    <AddModal
      isShowModal={isShowAddModal}
      onHide={() => setIsShowAddModal(false)}
      data={dataModal}
      onAdd={(p) => onAdd(p)}
      onEdit={(p) => onEdit(p)}
    />
  </>
}

export default App