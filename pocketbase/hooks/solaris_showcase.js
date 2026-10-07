routerAdd('GET', '/backend/v1/solaris/showcase/{arquivo}', (e) => {
  const arquivo = e.request.pathValue('arquivo')
  if (arquivo !== 'index.html' && arquivo !== 'support.js') {
    throw e.notFoundError('arquivo inválido')
  }
  const chave = arquivo === 'index.html' ? 'showcase_html' : 'showcase_support'
  let record = null
  try {
    record = $app.findFirstRecordByData('solaris_assets', 'chave', chave)
  } catch (err) {
    record = null
  }
  if (!record) throw e.notFoundError('showcase não publicado')
  const conteudo = record.get('conteudo') || ''
  if (!conteudo) throw e.notFoundError('showcase vazio')
  if (arquivo === 'index.html') return e.html(200, conteudo)
  return e.string(200, conteudo)
})
