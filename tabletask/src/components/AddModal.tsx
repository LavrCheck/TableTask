import { useEffect, useState } from "react"
import { Button, Col, Modal, Row } from "react-bootstrap"
import { Post } from "../types"
import { v4 as uuid } from 'uuid';

export const validateIBAN = (iban: string): boolean => {
    // Удаление пробелов и преобразование в верхний регистр
    iban = iban.replace(/\s/g, '').toUpperCase()

    // Проверка длины IBAN
    if (iban.length < 4 || iban.length > 34) {
        return false
    }

    // Проверка наличия только букв и цифр
    if (!/^[0-9A-Z]*$/.test(iban)) {
        return false;
    }

    // Перемещение первых 4 символов в конец
    iban = iban.substring(4) + iban.substring(0, 4)

    // Замена букв на цифры
    const charCodeA = 'A'.charCodeAt(0);
    const charCodeZ = 'Z'.charCodeAt(0);
    let numericIBAN = '';
    for (let i = 0; i < iban.length; i++) {
        const charCode = iban.charCodeAt(i);
        if (charCode >= charCodeA && charCode <= charCodeZ) {
            numericIBAN += (charCode - charCodeA + 10).toString()
        } else {
            numericIBAN += iban.charAt(i)
        }
    }

    // Преобразование IBAN в число и проверка контрольной суммы
    const remainder = numericIBAN.split('').reduce((previousValue, currentValue) => {
        const digit = parseInt(currentValue, 10)
        return (previousValue * 10 + digit) % 97
    }, 0);

    return remainder === 1
}  // Или можно воспользоваться отдельной библиотекой



export const AddModal = ({
    data,
    isShowModal,
    onHide,
    onEdit,
    onAdd
}: {
    data: Post | null
    isShowModal: boolean
    onHide: () => void
    onEdit: (x: Post) => void
    onAdd: (x: Post) => void
}) => {

    const [id, setId] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [client, setClient] = useState<string>('')
    const [product, setProduct] = useState<string>('')
    const [IBAN, setIBAN] = useState<string>('')
    const [article, setArticle] = useState<number | undefined | string>(undefined)

    useEffect(() => {
        if (data) {
            setId(data.id)
            setTitle(data.title)
            setClient(data.client)
            setProduct(data.product)
            setIBAN(data.IBAN)
            setArticle(data.article)
        } else {
            setId('')
            setTitle('')
            setClient('')
            setProduct('')
            setIBAN('')
            setArticle(undefined)
        }
    }, [data])



    return <>
        <Modal
            show={isShowModal}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title>{data ? 'Редактирование' : 'Добавление'} поста</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="flex-column">
                    <Col>
                        <input
                            className="form-control"
                            placeholder="Заголовок"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Col>
                    <Col className="my-3">
                        <input
                            className="form-control"
                            placeholder="Клиент"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                        />
                    </Col>
                    <Col >
                        <input
                            className="form-control"
                            placeholder="Продукт"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                        />
                    </Col>
                    <Col className="my-3">
                        <input
                            className="form-control"
                            placeholder="IBAN (с валидацией, проще скопировать)"
                            value={IBAN}
                            onChange={(e) => {
                                setIBAN(e.target.value
                                    .replace(/[^A-Z0-9]/g, '')
                                    .toUpperCase()
                                    .replace(/(.{4})/g, '$1 ')
                                    .trim())
                            }} // Только верхний регистр латиницы и цифры, пробелы через каждые 4 символа
                        />
                    </Col>
                    <Col>
                        <input
                            className="form-control"
                            placeholder="Артикул"
                            value={article}
                            onChange={(e) => {
                                e.target.value = e.target.value.replace(/\D/g, '')  // Только цифры
                                setArticle(e.target.value)
                            }}
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    disabled={!title || !client || !product || !validateIBAN(IBAN) || !article}
                    onClick={() => {
                        data ? onEdit({
                            id: id,
                            title: title,
                            client: client,
                            product: product,
                            IBAN: IBAN,
                            article: Number(article)
                        }) : onAdd({
                            id: uuid(),
                            title: title,
                            client: client,
                            product: product,
                            IBAN: IBAN,
                            article: Number(article)
                        })
                    }}
                    variant="success"
                >{data ? 'Редактировать' : 'Добавить'}</Button>
            </Modal.Footer>
        </Modal>
    </>
}