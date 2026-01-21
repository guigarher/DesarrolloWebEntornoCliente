import type { ReactNode } from "react";

type CardProps = {
  //body: string;
  children: ReactNode;
};

function Card(props: CardProps) {
  const { children } = props;
  return (
    <div className="card border border-2 border-primary shadow">
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
      <h5 className="card-title text-center fw-bold">{title}</h5>
      <p className="card-text fst-italic">{text}</p>
    </>
  );
}
