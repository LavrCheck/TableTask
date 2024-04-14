import { Button, Col, Modal, Row } from "react-bootstrap"

export const DeleteModal = ({
    isShowModal,
    onDelete,
    onHide
}: {
    isShowModal: boolean
    onDelete: () => void
    onHide: () => void
}) => {


    return <>
        <Modal
            show={isShowModal}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title>Удаление</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span>Вы действительно хотите удалить этот пост?</span>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onDelete}>Удалить</Button>
            </Modal.Footer>
        </Modal>

    </>
}