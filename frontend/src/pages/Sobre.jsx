import { Paisagem } from '../components/Decoracao';
const secoes = [
  {
    titulo: 'Objetivo',
    cor: 'azul',
    texto: 'Reunir informações sobre cientistas brasileiras em um só lugar, destacando suas áreas de atuação, principais contribuições e reconhecimentos. Queremos facilitar o acesso a essas histórias e incentivar o interesse pela ciência, mostrando a diversidade de mulheres que fazem parte dela.',
  },
  {
    titulo: 'Equipe',
    cor: 'rosa',
    texto: 'Projeto interdisciplinar do IFMG Sabará, realizado em colaboração por Ana Clara Fagundes, Ana Clara Seabra, Arthur Morais, Filipe Lage e Mallu Siqueira.',
  },
  {
    titulo: 'Como contribuir',
    cor: 'verde',
    texto: 'A ciência é feita por muitas pessoas, e suas histórias merecem ser conhecidas. Se você conhece uma cientista brasileira que deveria fazer parte do catálogo, pode sugerir seu nome para que sua trajetória seja considerada na ampliação do projeto.',
  },
];

export default function Sobre() {
  return (
    <>
      <section className="hero">
        <div>
          <h1>Sobre o projeto</h1>
          <p className="apoio">
            O Mulheres na Ciência nasceu da vontade de dar mais visibilidade às mulheres que contribuíram e continuam contribuindo para o avanço científico. Por meio de um catálogo dedicado a cientistas brasileiras, o projeto busca aproximar o público de suas histórias, pesquisas e conquistas, valorizando trajetórias que nem sempre recebem o reconhecimento que merecem.
          </p>
        </div>
        <div>
          <Paisagem />
        </div>
      </section>

      <div className="grade">
        {secoes.map(({ titulo, cor, texto }) => (
          <article key={titulo} className={`card card-topo cor-${cor}`}>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </article>
        ))}
      </div>
    </>
  );
}