import type { ReactNode } from "react";

type CardProps = {
  //body: string;
  children: ReactNode;
};

function Card(props: CardProps) {
  const { children } = props;
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {/*<CardBody></CardBody>*/}
        {children}
      </div>
    </div>
  );
}

export default Card;

type CardBodyProps = {
  title: string;
  text?: string;
};

export function CardBody(props: CardBodyProps) {
  const { title, text } = props;
  return (
    <>
      <h5 className="card-title">{title}</h5>
      <p className="card-text">{text}</p>
    </>
  );
}
