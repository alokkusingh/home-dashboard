import { Table, Row, Col, Modal, ModalHeader} from 'reactstrap';
import {Icon, Card} from 'react-materialize';

export function TileCard({title, x, a, b, c}) {

return (
    <Card style={{ width: '12.5rem', height: 250}}
      // color picker - https://materializecss.com/color.html
      className="teal lighten-4"
       //closeIcon={<Icon>close</Icon>}
       //revealIcon={<Icon>more_vert</Icon>}
       textClassName="blue-grey-text"
       title={title}
      >
       <Table striped borderless hover scrollable size="sm">
         <Row></Row>
         <Row style={{whiteSpace: "wrap", textAlign: "right", fontSize: ".9rem", color: "teal"}}><Col>{x.value}</Col><Col style={{fontSize: ".35rem", textAlign: "left", color: "black"}}>{x.text}</Col><Col></Col></Row>
         <Row style={{whiteSpace: "wrap", textAlign: "right", fontSize: ".65rem", color: "teal"}}><Col></Col><Col>{a.value}</Col><Col style={{fontSize: ".30rem", textAlign: "left", color: "black"}}>{a.text}</Col></Row>
         <Row style={{whiteSpace: "wrap", textAlign: "right", fontSize: ".65rem", color: "teal"}}><Col></Col><Col>{b.value}</Col><Col style={{fontSize: ".30rem", textAlign: "left", color: "black"}}>{b.text}</Col></Row>
         <Row style={{whiteSpace: "wrap", textAlign: "right", fontSize: ".55rem", color: "teal"}}><Col></Col><Col>{c.value}</Col><Col style={{fontSize: ".30rem", textAlign: "left", color: "black"}}>{c.text}</Col></Row>
       </Table>
      </Card>
)
}