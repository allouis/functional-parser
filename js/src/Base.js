class Functor {

  constructor(x) {
    this.value = x
  }

  fmap(f) {
    return new this.constructor(f(this.value))
  }

}

class Applicative extends Functor {

  apply(Af) {
    return Af.fmap(f => f(this.value))
  }

  static pure (x) {
    return new Applicative(x)
  }

}

class Monad extends Applicative {

  bind(f) {
    return this.fmap(f).value
    return f(this.value)
  }

  static return (x) {
    return new Monad(x)
  }

}

exports.Functor = Functor
exports.Applicative = Applicative
exports.Monad = Monad

assert = require('assert')
compose = f => g => x => f(g(x))
$ = y => f => f(y)
I = x => x
f = x => typeof x
g = x => x.length

// Functor laws

// identity

assert.deepEqual(
  (new Functor('value')).fmap(I),
  I(new Functor('value')),
  'Functor: Identity'
)

// composition

assert.deepEqual(
  (new Functor('value')).fmap(compose(g)(f)),
  (new Functor('value')).fmap(f).fmap(g),
  'Functor: Composition'
)

// Applicative laws

// identity

assert.deepEqual(
  Applicative.pure('value').apply(Applicative.pure(I)),
  I(Applicative.pure('value')),
  'Applicative: Identity'
)

// homomorphism

assert.deepEqual(
  Applicative.pure('value').apply(Applicative.pure(f)),
  Applicative.pure(f('value')),
  'Applicative: Homomorphism'
)

// interchange

assert.deepEqual(
  Applicative.pure('y').apply(Applicative.pure(f)),
  Applicative.pure(f).apply(Applicative.pure($('y'))),
  'Applicative: Interchange'
)

// composition

assert.deepEqual(
  Applicative.pure('value').apply(Applicative.pure(compose(g)(f))),
  Applicative.pure('value').apply(Applicative.pure(f)).apply(Applicative.pure(g)),
  'Applicative: Composition'
)

// bonus fmap

assert.deepEqual(
  Applicative.pure('value').fmap(f),
  Applicative.pure('value').apply(Applicative.pure(f)),
  'Application: fmap relationship'
)


// Monad laws

Mf = x => Monad.return(`!${x}!`)

Mg = x => Monad.return(x.length)

// left identity

assert.deepEqual(
  Monad.return('a').bind(Mf),
  Mf('a'),
  'Monad: Left Identity'
)

// right identity

m = new Monad('a')

assert.deepEqual(
  m.bind(Monad.return),
  m,
  'Monad: Right Identity'
)

// associativity

assert.deepEqual(
  m.bind(Mf).bind(Mg),
  m.bind(x => Mf(x).bind(Mg)),
  'Monad: Associativity'
)
