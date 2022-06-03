class Validation {
  static email(email: string | undefined) {
    if (!email) {
      throw Error("Missing data")
    }
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!regex.test(email)) {
      throw Error("Invalid e-mail")
    }
  }

  static password(arg: string | undefined) {
    if (!arg) {
      throw Error("Missing data")
    }
    if (arg.length < 8 || arg.length > 255) {
      throw Error("Invalid password")
    }
  }
}

export default Validation