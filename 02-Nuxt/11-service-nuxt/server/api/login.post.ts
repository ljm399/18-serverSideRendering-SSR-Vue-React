export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const body = await readBody<{ username: string; password: number }>(event)

  if (body?.username === 'admin' && String(body?.password) === '123456') {
    const token = 'token_' + String(query.id ?? '')

    return {
      code: 0,
      data: {
        token
      }
    }
  }

  return {
    code: -1,
    data: null
  }
})
