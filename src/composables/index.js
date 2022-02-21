const convertToUTCDate = (date) => {
  const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  return new Date(utc)
}

export { convertToUTCDate }