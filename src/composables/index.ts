import { useStore } from 'vuex'

const getFromStoreByType = (moduleName, type, isNamespaced) => {
  if (isNamespaced) {
    return Object.keys(type)
      .filter((t) => t.startsWith(`${moduleName}/`))
      .reduce((acc, curr) => {
        const typeName = curr.split("/").pop()
        const typeValue = type[curr][0]

        return { [typeName]: typeValue, ...acc }
      }, {})
  }

  return Object.keys(type).reduce((acc, curr) => {
    const typeValue = type[curr][0]
    return { [curr]: typeValue, ...acc }
  }, {})
}

const wrapGettersInProxy = (moduleName, getters, isNamespaced) => {
  return new Proxy(getters, {
    get(_, prop) {
      if (isNamespaced) {
        return getters[`${moduleName}/${prop}`]
      }

      return getters[prop]
    }
  })
}

const isModuleNamespaced = (moduleName, store) => {
  return Boolean(store._modulesNamespaceMap[`${moduleName}/`])
}

const useStoreModule = (moduleName) => {
  const store = useStore()
  const state = store.state[moduleName]
  const isNamespaced = isModuleNamespaced(moduleName, store)

  const actions = getFromStoreByType(moduleName, store._actions, isNamespaced)
  const mutations = getFromStoreByType(moduleName, store._mutations, isNamespaced)
  const getters = wrapGettersInProxy(moduleName, store.getters, isNamespaced)

  return {
    actions, mutations, state, getters
  }
}

export { useStoreModule }