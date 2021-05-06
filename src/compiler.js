
import parse from "./parser.js"
import analyze from "./analyzer.js"
import optimize from "./optimizer.js"
import generate from "./generator.js"

export default function compile(source, outputType) {
  outputType = outputType.toLowerCase()
  if (outputType === "ast") {
    return parse(source)
  } else if (outputType === "analyzed") {
    return analyze(parse(source))
  } else if (outputType === "optimized") {
    return optimize(analyze(parse(source)))
  } else if (outputType === "js") {
    return generate(optimize(analyze(parse(source))))
  }
  else {
    return "Unknown output type"
  }
}