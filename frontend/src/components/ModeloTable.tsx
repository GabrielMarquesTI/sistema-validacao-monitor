import { type ModeloAdmin } from "../types";

interface ModeloTableProps {
  modelos: ModeloAdmin[];
}

export default function ModeloTable({ modelos }: ModeloTableProps) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>Tabela de Modelos</h2>

      <table width="100%" border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Tamanho</th>
          </tr>
        </thead>

        <tbody>
          {modelos.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Nenhum modelo encontrado
              </td>
            </tr>
          ) : (
            modelos.map((modelo) => (
              <tr key={modelo.id}>
                <td>{modelo.id}</td>
                <td>{modelo.modelo}</td>
                <td>{modelo.tipo}</td>
                <td>{modelo.marca}</td>
                <td>{modelo.tamanho_polegadas ?? "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
