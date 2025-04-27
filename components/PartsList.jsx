export default function PartsList({ parts }) {
    return (
      <div>
        {parts.map(part => (
          <div key={part.partsId}>
            <h3>{part.name}</h3>
            <p>Цена: {part.price}</p>
          </div>
        ))}
      </div>
    );
  }