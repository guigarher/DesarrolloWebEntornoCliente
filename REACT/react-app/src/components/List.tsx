import ListGroup from "react-bootstrap/ListGroup";

type ListProps = {
  data: string[];
};

export default function List(props: ListProps) {
  const { data } = props;

  return (
    <ListGroup>
      {data.map((elemento, index) => (
        <ListGroup.Item key={index}>{elemento}</ListGroup.Item>
      ))}
    </ListGroup>
  );
}
