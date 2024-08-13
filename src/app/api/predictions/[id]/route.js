import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const { rows } = await query(
      `SELECT * FROM matches WHERE id = $1 AND prediction IS NOT NULL`,
      [id]
    );
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Predicción no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const body = await request.json();
    const { prediction, odds } = body;

    const { rowCount } = await query(
      `UPDATE matches SET prediction = $1, odds = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 AND prediction IS NOT NULL`,
      [prediction, odds, id]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { error: "Predicción no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Predicción actualizada con éxito" });
  } catch (error) {
    console.error("Error updating prediction:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const { rowCount } = await query(
      `DELETE FROM matches WHERE id = $1 AND prediction IS NOT NULL`,
      [id]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { error: "Predicción no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Predicción eliminada con éxito" });
  } catch (error) {
    console.error("Error eliminando predicción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
