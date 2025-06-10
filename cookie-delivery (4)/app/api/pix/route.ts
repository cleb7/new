import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cpf, valor, nome } = body

    // Validações básicas
    if (!cpf || !valor || !nome) {
      return NextResponse.json({ success: false, error: "Dados incompletos" }, { status: 400 })
    }

    // Configurações da API BlackCat
    const secretKey = "sk_IZAJH_oa8uvZv9C2qJv8825K7dQ-vTZDtEx6XmaGcM4T2beO"
    const apiUrl = "https://api.goldenbankoficial.com/v1/transactions"

    // Preparar payload para a BlackCat
    const amountInCents = Math.round(valor * 100)

    const data = {
      paymentMethod: "pix",
      customer: {
        document: {
          type: "cpf",
          number: cpf.replace(/\D/g, ""),
        },
        name: nome,
        email: "suporte@pagamentoonline.com",
        phone: "81999999999",
      },
      installments: 1,
      amount: amountInCents,
      pix: {
        expiresInDays: 1,
      },
      items: [
        {
          title: "Pedido Cookie Pink",
          unitPrice: amountInCents,
          quantity: 1,
          externalRef: "PAG-" + cpf.slice(-4) + "-" + Date.now(),
          tangible: false,
        },
      ],
      card: {},
    }

    // Fazer requisição para a API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${secretKey}:x`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: responseData.error || "Erro na API" },
        { status: response.status },
      )
    }

    // Retornar dados do PIX
    return NextResponse.json({
      success: true,
      txid: responseData.id,
      qrcode_text: responseData.pix?.qrcode || "",
      qrcode_image: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(responseData.pix?.qrcode || "")}`,
    })
  } catch (error) {
    console.error("Erro no processamento:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
