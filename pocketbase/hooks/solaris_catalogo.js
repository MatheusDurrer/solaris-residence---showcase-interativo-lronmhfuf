routerAdd('GET', '/backend/v1/solaris/catalogo', (e) => {
  const records = $app.findRecordsByFilter('solaris_unidades', '', 'numero', 200, 0)
  const unidades = []
  for (let i = 0; i < records.length; i++) {
    const r = records[i]
    unidades.push({
      numero: r.get('numero'),
      andar: r.get('andar'),
      final: r.get('final'),
      tipologia: r.get('tipologia'),
      posicao: r.get('posicao'),
      orientacao: r.get('orientacao'),
      area: r.get('area'),
      vaga: r.get('vaga'),
      valor: r.get('valor'),
      status: r.get('status'),
      planta: r.get('planta'),
      cota: r.get('cota'),
      fachada: r.get('fachada'),
      poly: r.get('poly'),
    })
  }
  let nome = 'Solaris Residence'
  let dados = null
  let obra = null
  try {
    const cfg = $app.findRecordsByFilter('solaris_config', "chave = 'showcase'", '', 5, 0)
    for (let i = 0; i < cfg.length; i++) {
      let d = cfg[i].get('dados')
      if (typeof d === 'string') {
        try {
          d = JSON.parse(d)
        } catch (err) {
          d = null
        }
      } else if (d && String(d).charAt(0) === '{') {
        try {
          d = JSON.parse(String(d))
        } catch (err) {
          d = null
        }
      }
      if (d) {
        if (d.nome) nome = d.nome
        if (d.dados) dados = d.dados
        if (d.obra) obra = d.obra
      }
    }
  } catch (err) {
    $app.logger().warn('solaris_catalogo: config ausente', 'error', String(err))
  }
  return e.json(200, { unidades: unidades, config: { nome: nome, dados: dados, obra: obra } })
})
