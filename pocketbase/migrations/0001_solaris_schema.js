migrate(
  (app) => {
    app.save(
      new Collection({
        name: 'solaris_unidades',
        type: 'base',
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'numero', type: 'number', required: true, onlyInt: true },
          { name: 'andar', type: 'number', required: true, onlyInt: true },
          { name: 'final', type: 'text', required: true },
          { name: 'tipologia', type: 'text', required: true },
          { name: 'posicao', type: 'text', required: true },
          { name: 'orientacao', type: 'text', required: true },
          { name: 'area', type: 'number', required: true },
          { name: 'vaga', type: 'text', required: true },
          { name: 'valor', type: 'number', required: true },
          {
            name: 'status',
            type: 'select',
            required: true,
            values: ['disponivel', 'reservada', 'vendida'],
            maxSelect: 1,
          },
          { name: 'planta', type: 'text', required: true },
          { name: 'cota', type: 'number', required: true },
          { name: 'fachada', type: 'text', required: true },
          { name: 'poly', type: 'json', maxSize: 2000 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )
    app.save(
      new Collection({
        name: 'solaris_config',
        type: 'base',
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'chave', type: 'text', required: true },
          { name: 'dados', type: 'json', maxSize: 20000 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )
    app.save(
      new Collection({
        name: 'solaris_assets',
        type: 'base',
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'chave', type: 'text', required: true },
          { name: 'conteudo', type: 'text', required: true, max: 400000 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )
    try {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      users.createRule = null
      app.save(users)
    } catch (err) {
      console.log('solaris: users collection not found, signup already closed')
    }
  },
  (app) => {
    for (const name of ['solaris_unidades', 'solaris_config', 'solaris_assets']) {
      try {
        app.delete(app.findCollectionByNameOrId(name))
      } catch (err) {
        console.log('solaris down: ' + name)
      }
    }
  },
)
