export function createTransaction(data) {
  return {
    type: data.type, // "income" | "expense"
    amount: Number(data.amount),
    category: data.category || "",
    description: data.description || "",
    date: data.date ? new Date(data.date) : new Date(),
    createdAt: new Date()
  }
}
