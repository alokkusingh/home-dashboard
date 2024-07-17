import { Table, Row, Col } from 'reactstrap';
import {Card} from 'react-materialize';

export function TileCard({title, x, a, b, c}) {

return (
    <Card style={{ width: '12.9rem', height: 220}}
      // color picker - https://materializecss.com/color.html
      className="teal lighten-4"
       //closeIcon={<Icon>close</Icon>}
       //revealIcon={<Icon>more_vert</Icon>}
       textClassName="blue-grey-text"
       title={title}
      >
       <Table striped borderless hover scrollable size="sm">
         <Row></Row>
         <Row style={{whiteSpace: "wrap", textAlign: "right", fontSize: "1rem", color: "teal"}}><Col>{x.value}</Col><Col style={{fontSize: ".45rem", textAlign: "left", color: "black"}}>{x.text}</Col><Col></Col></Row>
         <Row style={{whiteSpace: "wrap", textAlign: "right", fontSize: ".75rem", color: "teal"}}><Col></Col><Col>{a.value}</Col><Col style={{fontSize: ".40rem", textAlign: "left", color: "black"}}>{a.text}</Col></Row>
         <Row style={{whiteSpace: "wrap", textAlign: "right", fontSize: ".75rem", color: "teal"}}><Col></Col><Col>{b.value}</Col><Col style={{fontSize: ".40rem", textAlign: "left", color: "black"}}>{b.text}</Col></Row>
         <Row style={{whiteSpace: "wrap", textAlign: "right", fontSize: ".75rem", color: "teal"}}><Col></Col><Col>{c.value}</Col><Col style={{fontSize: ".40rem", textAlign: "left", color: "black"}}>{c.text}</Col></Row>
       </Table>
      </Card>
)
}