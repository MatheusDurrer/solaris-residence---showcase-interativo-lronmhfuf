routerAdd('POST', '/backend/v1/solaris/importar', (e) => {
  const expected = $secrets.get('SOLARIS_IMPORT_SECRET') || ''
  if (!expected) throw e.forbiddenError('Importação desativada.')
  const got = e.request.header.get('X-Import-Secret') || ''
  if (got !== expected) throw e.forbiddenError('Segredo inválido.')
  const body = e.requestInfo().body || {}
  const kind = String(body.chave || '')
  if (kind !== 'unidades' && kind !== 'config' && kind !== 'asset') {
    throw e.badRequestError('chave inválida')
  }
  if (kind === 'unidades') {
    const list = body.unidades
    if (!list || !list.length || list.length > 200) throw e.badRequestError('unidades inválidas')
    let imported = 0
    for (let i = 0; i < list.length; i++) {
      const u = list[i]
      let existing = null
      try {
        existing = $app.findFirstRecordByData('solaris_unidades', 'numero', u.numero)
      } catch (err) {
        existing = null
      }
      const record = existing || new Record($app.findCollectionByNameOrId('solaris_unidades'))
      record.set('numero', u.numero)
      record.set('andar', u.andar)
      record.set('final', u.final)
      record.set('tipologia', u.tipologia)
      record.set('posicao', u.posicao)
      record.set('orientacao', u.orientacao)
      record.set('area', u.area)
      record.set('vaga', u.vaga)
      record.set('valor', u.valor)
      record.set('status', u.status)
      record.set('planta', u.planta)
      record.set('cota', u.cota)
      record.set('fachada', u.fachada)
      record.set('poly', u.poly || null)
      $app.save(record)
      imported++
    }
    return e.json(200, { ok: true, imported: imported })
  }
  if (kind === 'config') {
    const data = body.dados || {}
    let existing = null
    try {
      existing = $app.findFirstRecordByData('solaris_config', 'chave', 'showcase')
    } catch (err) {
      existing = null
    }
    const record = existing || new Record($app.findCollectionByNameOrId('solaris_config'))
    record.set('chave', 'showcase')
    record.set('dados', data)
    $app.save(record)
    return e.json(200, { ok: true })
  }
  const chave = String(body.asset_chave || '')
  if (!chave) throw e.badRequestError('asset_chave inválida')
  const conteudo = String(body.conteudo || '')
  if (!conteudo || conteudo.length > 400000) throw e.badRequestError('conteudo inválido')
  let existing = null
  try {
    existing = $app.findFirstRecordByData('solaris_assets', 'chave', chave)
  } catch (err) {
    existing = null
  }
  const record = existing || new Record($app.findCollectionByNameOrId('solaris_assets'))
  record.set('chave', chave)
  record.set('conteudo', conteudo)
  $app.save(record)
  return e.json(200, { ok: true, chave: chave })
})
