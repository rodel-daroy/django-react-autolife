function Console(env = process.env.NODE_ENV) {
  const production = env === "production";

  for(const key of Object.getOwnPropertyNames(window.console))
    if(typeof window.console[key] === "function") {
      if(production)
        this[key] = () => {};
      else
        this[key] = window.console[key].bind(window.console);
    }
}

export default new Console();