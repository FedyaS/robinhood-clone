function tenPercentMore(num) {
  return Math.floor(num * 1.10)
}

function tenPercentLess(num) {
    return Math.round(num * 0.90)
}

export {tenPercentMore, tenPercentLess};