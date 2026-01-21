type TituloProps = {
  texto: string;
};

export default function Titulo({ texto }: TituloProps) {
  return <h1 className="text-center my-4">{texto}</h1>;
}
