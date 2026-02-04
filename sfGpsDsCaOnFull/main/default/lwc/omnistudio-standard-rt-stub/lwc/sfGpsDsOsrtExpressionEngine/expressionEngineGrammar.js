// Generated automatically by nearley, version 2.19.9
// http://github.com/Hardmath123/nearley
function id(x) {
  return x[0];
}

import EXPRESSIONS from "./expressions";
let templateResolverFn = null;
let randomNumberGenerator = null;

export function setTemplateResolverFn(templateResolverFn_) {
  templateResolverFn = templateResolverFn_;
}

export function setRandomGenerator(randomNumberGenerator_) {
  randomNumberGenerator = randomNumberGenerator_;
}

const resolveToken = function (token) {
  if (templateResolverFn) {
    return templateResolverFn(token);
  }
  return null;
};

const tokenRegex = /([^%]|^)%([^[%]+)%/g;
const parseTokensInString = function (str) {
  return str
    .replace(tokenRegex, function (match, p1, p2) {
      return p1 + resolveToken(p2);
    })
    .replace(/%%/g, "%");
};
let Lexer = undefined;
let ParserRules = [
  {
    name: "main",
    symbols: ["_", "ExpList", "_"],
    postprocess: function (d) {
      if (d[1]) {
        if (d[1]._list) {
          return d[1]._list;
        } else if (d[1]._array) {
          return d[1]._array;
        }
      }
      return d[1];
    }
  },
  { name: "ExpList", symbols: ["Exp"], postprocess: id },
  {
    name: "ExpList",
    symbols: ["ExpList", "_", { literal: "," }, "_", "Exp"],
    postprocess: function (d) {
      if (!d[0]) {
        return { _list: [d[0], d[4]] };
      }
      if (Array.isArray(d[0]._list)) {
        return {
          _list: d[0]._list.concat(d[4])
        };
      }
      return {
        _list: [d[0], d[4]]
      };
    }
  },
  { name: "JSFnCall", symbols: ["FunctionCall"], postprocess: id },
  { name: "JSFnCall$ebnf$1", symbols: [] },
  {
    name: "JSFnCall$ebnf$1",
    symbols: ["JSFnCall$ebnf$1", /[a-zA-Z]/],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "JSFnCall",
    symbols: ["JSFnCall", "_", { literal: "." }, "_", "JSFnCall$ebnf$1"],
    postprocess: function (d) {
      var propName = d[4].join("");
      return d[0][propName];
    }
  },
  { name: "JSFnCall$ebnf$2", symbols: [] },
  {
    name: "JSFnCall$ebnf$2",
    symbols: ["JSFnCall$ebnf$2", /[a-zA-Z]/],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "JSFnCall",
    symbols: [
      "JSFnCall",
      "_",
      { literal: "." },
      "_",
      "JSFnCall$ebnf$2",
      "_",
      "Args"
    ],
    postprocess: function (d) {
      var funcName = d[4].join("");
      return d[0][funcName].apply(d[0], d[6]._list);
    }
  },
  {
    name: "FunctionCall$string$1",
    symbols: [
      { literal: "n" },
      { literal: "e" },
      { literal: "w" },
      { literal: " " },
      { literal: "D" },
      { literal: "a" },
      { literal: "t" },
      { literal: "e" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$1", "_", "Args"],
    postprocess: function (d) {
      return new (Function.prototype.bind.apply(
        Date,
        [null].concat(d[2]._list)
      ))();
    }
  },
  {
    name: "FunctionCall$string$2",
    symbols: [
      { literal: "n" },
      { literal: "e" },
      { literal: "w" },
      { literal: " " },
      { literal: "D" },
      { literal: "A" },
      { literal: "T" },
      { literal: "E" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$2", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.DATE.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$3",
    symbols: [
      { literal: "E" },
      { literal: "Q" },
      { literal: "U" },
      { literal: "A" },
      { literal: "L" },
      { literal: "S" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$3", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.EQUALS.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$4",
    symbols: [
      { literal: "N" },
      { literal: "O" },
      { literal: "T" },
      { literal: "E" },
      { literal: "Q" },
      { literal: "U" },
      { literal: "A" },
      { literal: "L" },
      { literal: "S" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$4", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.NOTEQUALS.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$5",
    symbols: [
      { literal: "C" },
      { literal: "O" },
      { literal: "M" },
      { literal: "P" },
      { literal: "A" },
      { literal: "R" },
      { literal: "E" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$5", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.COMPARE.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$6",
    symbols: [{ literal: "A" }, { literal: "N" }, { literal: "D" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$6", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.AND.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$7",
    symbols: [{ literal: "O" }, { literal: "R" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$7", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.OR.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$8",
    symbols: [
      { literal: "S" },
      { literal: "T" },
      { literal: "R" },
      { literal: "I" },
      { literal: "N" },
      { literal: "G" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$8", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.STRING.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$9",
    symbols: [
      { literal: "S" },
      { literal: "t" },
      { literal: "r" },
      { literal: "i" },
      { literal: "n" },
      { literal: "g" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$9", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.STRING.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$10",
    symbols: [
      { literal: "N" },
      { literal: "U" },
      { literal: "M" },
      { literal: "B" },
      { literal: "E" },
      { literal: "R" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$10", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.NUMBER.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$11",
    symbols: [
      { literal: "I" },
      { literal: "N" },
      { literal: "T" },
      { literal: "E" },
      { literal: "G" },
      { literal: "E" },
      { literal: "R" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$11", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.INTEGER.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$12",
    symbols: [
      { literal: "C" },
      { literal: "U" },
      { literal: "R" },
      { literal: "R" },
      { literal: "E" },
      { literal: "N" },
      { literal: "C" },
      { literal: "Y" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$12", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.CURRENCY.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$13",
    symbols: [
      { literal: "B" },
      { literal: "O" },
      { literal: "O" },
      { literal: "L" },
      { literal: "E" },
      { literal: "A" },
      { literal: "N" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$13", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.BOOLEAN.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$14",
    symbols: [
      { literal: "R" },
      { literal: "A" },
      { literal: "N" },
      { literal: "D" },
      { literal: "O" },
      { literal: "M" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$14", "_", "Args"],
    postprocess: function (d) {
      if (randomNumberGenerator) {
        return randomNumberGenerator(d[2]._list);
      }
      return EXPRESSIONS.RANDOM.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$15",
    symbols: [
      { literal: "D" },
      { literal: "A" },
      { literal: "T" },
      { literal: "E" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$15", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.DATE.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$16",
    symbols: [
      { literal: "M" },
      { literal: "O" },
      { literal: "M" },
      { literal: "E" },
      { literal: "N" },
      { literal: "T" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$16", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.MOMENT.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$17",
    symbols: [
      { literal: "M" },
      { literal: "O" },
      { literal: "M" },
      { literal: "E" },
      { literal: "N" },
      { literal: "T" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$17"],
    postprocess: function (d) {
      return EXPRESSIONS.MOMENT;
    }
  },
  {
    name: "FunctionCall$string$18",
    symbols: [
      { literal: "C" },
      { literal: "O" },
      { literal: "N" },
      { literal: "C" },
      { literal: "A" },
      { literal: "T" },
      { literal: "E" },
      { literal: "N" },
      { literal: "A" },
      { literal: "T" },
      { literal: "E" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$18", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.CONCATENATE.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$19",
    symbols: [
      { literal: "C" },
      { literal: "A" },
      { literal: "S" },
      { literal: "E" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$19", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.CASE.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$20",
    symbols: [
      { literal: "S" },
      { literal: "U" },
      { literal: "B" },
      { literal: "S" },
      { literal: "T" },
      { literal: "R" },
      { literal: "I" },
      { literal: "N" },
      { literal: "G" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$20", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.SUBSTRING.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$21",
    symbols: [
      { literal: "S" },
      { literal: "P" },
      { literal: "L" },
      { literal: "I" },
      { literal: "T" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$21", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.SPLIT.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$22",
    symbols: [{ literal: "S" }, { literal: "U" }, { literal: "M" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$22", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.SUM.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$23",
    symbols: [
      { literal: "S" },
      { literal: "U" },
      { literal: "M" },
      { literal: "I" },
      { literal: "F" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$23", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.SUMIF.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$24",
    symbols: [
      { literal: "C" },
      { literal: "O" },
      { literal: "U" },
      { literal: "N" },
      { literal: "T" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$24", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.COUNT.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$25",
    symbols: [
      { literal: "C" },
      { literal: "O" },
      { literal: "U" },
      { literal: "N" },
      { literal: "T" },
      { literal: "I" },
      { literal: "F" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$25", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.COUNTIF.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$26",
    symbols: [
      { literal: "A" },
      { literal: "V" },
      { literal: "E" },
      { literal: "R" },
      { literal: "A" },
      { literal: "G" },
      { literal: "E" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$26", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.AVERAGE.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$27",
    symbols: [{ literal: "M" }, { literal: "A" }, { literal: "X" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$27", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.MAX.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$28",
    symbols: [{ literal: "M" }, { literal: "I" }, { literal: "N" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$28", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.MIN.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$29",
    symbols: [
      { literal: "E" },
      { literal: "X" },
      { literal: "I" },
      { literal: "S" },
      { literal: "T" },
      { literal: "S" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$29", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.EXISTS.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$30",
    symbols: [
      { literal: "C" },
      { literal: "O" },
      { literal: "N" },
      { literal: "T" },
      { literal: "A" },
      { literal: "I" },
      { literal: "N" },
      { literal: "S" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$30", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.CONTAINS.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$31",
    symbols: [
      { literal: "R" },
      { literal: "O" },
      { literal: "U" },
      { literal: "N" },
      { literal: "D" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$31", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.ROUND.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$32",
    symbols: [{ literal: "A" }, { literal: "B" }, { literal: "S" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$32", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.ABS.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$33",
    symbols: [{ literal: "P" }, { literal: "O" }, { literal: "W" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$33", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.POW.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$34",
    symbols: [{ literal: "N" }, { literal: "O" }, { literal: "W" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$34", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.NOW.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$35",
    symbols: [
      { literal: "T" },
      { literal: "O" },
      { literal: "D" },
      { literal: "A" },
      { literal: "Y" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$35", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.TODAY.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$36",
    symbols: [{ literal: "A" }, { literal: "G" }, { literal: "E" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$36", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.AGE.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$37",
    symbols: [
      { literal: "A" },
      { literal: "G" },
      { literal: "E" },
      { literal: "O" },
      { literal: "N" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$37", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.AGEON.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$38",
    symbols: [
      { literal: "D" },
      { literal: "A" },
      { literal: "T" },
      { literal: "E" },
      { literal: "D" },
      { literal: "I" },
      { literal: "F" },
      { literal: "F" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$38", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.DATEDIFF.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$39",
    symbols: [
      { literal: "D" },
      { literal: "A" },
      { literal: "Y" },
      { literal: "O" },
      { literal: "F" },
      { literal: "M" },
      { literal: "O" },
      { literal: "N" },
      { literal: "T" },
      { literal: "H" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$39", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.DAYOFMONTH.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$40",
    symbols: [
      { literal: "D" },
      { literal: "A" },
      { literal: "Y" },
      { literal: "O" },
      { literal: "F" },
      { literal: "W" },
      { literal: "E" },
      { literal: "E" },
      { literal: "K" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$40", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.DAYOFWEEK.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$41",
    symbols: [
      { literal: "M" },
      { literal: "O" },
      { literal: "N" },
      { literal: "T" },
      { literal: "H" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$41", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.MONTH.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$42",
    symbols: [
      { literal: "Y" },
      { literal: "E" },
      { literal: "A" },
      { literal: "R" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$42", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.YEAR.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$43",
    symbols: [
      { literal: "H" },
      { literal: "O" },
      { literal: "U" },
      { literal: "R" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$43", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.HOUR.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$44",
    symbols: [
      { literal: "M" },
      { literal: "I" },
      { literal: "N" },
      { literal: "U" },
      { literal: "T" },
      { literal: "E" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$44", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.MINUTE.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$45",
    symbols: [{ literal: "I" }, { literal: "F" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$45", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.IF.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$46",
    symbols: [
      { literal: "R" },
      { literal: "E" },
      { literal: "P" },
      { literal: "L" },
      { literal: "A" },
      { literal: "C" },
      { literal: "E" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$46", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.REPLACE.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "FunctionCall$string$47",
    symbols: [
      { literal: "S" },
      { literal: "A" },
      { literal: "N" },
      { literal: "I" },
      { literal: "T" },
      { literal: "I" },
      { literal: "Z" },
      { literal: "E" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "FunctionCall",
    symbols: ["FunctionCall$string$47", "_", "Args"],
    postprocess: function (d) {
      return EXPRESSIONS.SANITIZE.apply(EXPRESSIONS, d[2]._list);
    }
  },
  {
    name: "Args",
    symbols: [{ literal: "(" }, "_", { literal: ")" }],
    postprocess: function (d) {
      return { _list: [] };
    }
  },
  {
    name: "Args",
    symbols: [{ literal: "(" }, "_", "ExpList", "_", { literal: ")" }],
    postprocess: function (d) {
      return d[2] && d[2]._list ? d[2] : { _list: [d[2]] };
    }
  },
  {
    name: "ArrayIndex",
    symbols: [
      "FunctionCall",
      { literal: "[" },
      "_",
      "Exp",
      "_",
      { literal: "]" }
    ],
    postprocess: function (d) {
      if (d[0]._array) {
        return d[0]._array[d[3]];
      }
      return d[0][d[3]];
    }
  },
  {
    name: "ArrayIndex",
    symbols: ["Array", { literal: "[" }, "_", "Exp", "_", { literal: "]" }],
    postprocess: function (d) {
      if (d[0]._array) {
        return d[0]._array[d[3]];
      }
      return d[0][d[3]];
    }
  },
  { name: "Exp", symbols: ["Binop"], postprocess: id },
  { name: "Binop", symbols: ["ExpOr"], postprocess: id },
  {
    name: "Array",
    symbols: [{ literal: "[" }, "_", { literal: "]" }],
    postprocess: function (d) {
      return {
        _array: []
      };
    }
  },
  { name: "Array$ebnf$1", symbols: [] },
  {
    name: "Array$ebnf$1$subexpression$1",
    symbols: ["_", { literal: "," }, "_", "Exp"]
  },
  {
    name: "Array$ebnf$1",
    symbols: ["Array$ebnf$1", "Array$ebnf$1$subexpression$1"],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "Array",
    symbols: [
      { literal: "[" },
      "_",
      "Exp",
      "Array$ebnf$1",
      "_",
      { literal: "]" }
    ],
    postprocess: function (d) {
      let output = [d[2]];
      if (Array.isArray(d[3])) {
        d[3].forEach((e) => {
          output.push(e[3]);
        });
      }
      return {
        _array: output
      };
    }
  },
  {
    name: "Array$string$1",
    symbols: [
      { literal: "A" },
      { literal: "R" },
      { literal: "R" },
      { literal: "A" },
      { literal: "Y" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "Array",
    symbols: ["Array$string$1", "_", "Args"],
    postprocess: function (d) {
      return {
        _array: EXPRESSIONS.ARRAY.apply(EXPRESSIONS, d[2]._list)
      };
    }
  },
  { name: "Parenthesized$ebnf$1", symbols: [] },
  {
    name: "Parenthesized$ebnf$1$subexpression$1",
    symbols: ["_", { literal: "," }, "_", "Exp"]
  },
  {
    name: "Parenthesized$ebnf$1",
    symbols: ["Parenthesized$ebnf$1", "Parenthesized$ebnf$1$subexpression$1"],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "Parenthesized",
    symbols: [
      { literal: "(" },
      "_",
      "Exp",
      "Parenthesized$ebnf$1",
      "_",
      { literal: ")" }
    ],
    postprocess: function (d) {
      let lastResult = d[2];
      if (Array.isArray(d[3])) {
        d[3].forEach((child) => {
          lastResult = child[3];
        });
      }
      return lastResult;
    }
  },
  {
    name: "ExpOr$string$1",
    symbols: [{ literal: "|" }, { literal: "|" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "ExpOr",
    symbols: ["ExpOr", "_", "ExpOr$string$1", "_", "ExpAnd"],
    postprocess: function (d) {
      return EXPRESSIONS.OR(d[0], d[4]);
    }
  },
  {
    name: "ExpOr",
    symbols: ["ExpOr", "_", { literal: "|" }, "_", "ExpAnd"],
    postprocess: function (d) {
      return d[0] | d[4];
    }
  },
  { name: "ExpOr", symbols: ["ExpAnd"], postprocess: id },
  {
    name: "ExpAnd$string$1",
    symbols: [{ literal: "&" }, { literal: "&" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "ExpAnd",
    symbols: ["ExpAnd", "_", "ExpAnd$string$1", "_", "ExpComparison"],
    postprocess: function (d) {
      return EXPRESSIONS.AND(d[0], d[4]);
    }
  },
  {
    name: "ExpAnd",
    symbols: ["ExpAnd", "_", { literal: "&" }, "_", "ExpComparison"],
    postprocess: function (d) {
      return d[0] & d[4];
    }
  },
  { name: "ExpAnd", symbols: ["ExpComparison"], postprocess: id },
  { name: "ExpAnd", symbols: ["DeferedExpComparison"], postprocess: id },
  {
    name: "DeferedExpComparison",
    symbols: [{ literal: "<" }, "_", "ExpSum"],
    postprocess: function (d) {
      return function (ele) {
        return EXPRESSIONS.COMPARE("<", ele, d[2]);
      };
    }
  },
  {
    name: "DeferedExpComparison",
    symbols: [{ literal: ">" }, "_", "ExpSum"],
    postprocess: function (d) {
      return function (ele) {
        return EXPRESSIONS.COMPARE(">", ele, d[2]);
      };
    }
  },
  {
    name: "DeferedExpComparison$string$1",
    symbols: [{ literal: "<" }, { literal: "=" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "DeferedExpComparison",
    symbols: ["DeferedExpComparison$string$1", "_", "ExpSum"],
    postprocess: function (d) {
      return function (ele) {
        return EXPRESSIONS.COMPARE("<=", ele, d[2]);
      };
    }
  },
  {
    name: "DeferedExpComparison$string$2",
    symbols: [{ literal: ">" }, { literal: "=" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "DeferedExpComparison",
    symbols: ["DeferedExpComparison$string$2", "_", "ExpSum"],
    postprocess: function (d) {
      return function (ele) {
        return EXPRESSIONS.COMPARE(">=", ele, d[2]);
      };
    }
  },
  {
    name: "DeferedExpComparison$string$3",
    symbols: [{ literal: "=" }, { literal: "=" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "DeferedExpComparison",
    symbols: ["DeferedExpComparison$string$3", "_", "ExpSum"],
    postprocess: function (d) {
      return function (ele) {
        return EXPRESSIONS.EQUALS(ele, d[2]);
      };
    }
  },
  {
    name: "DeferedExpComparison$string$4",
    symbols: [{ literal: "!" }, { literal: "=" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "DeferedExpComparison",
    symbols: ["DeferedExpComparison$string$4", "_", "ExpSum"],
    postprocess: function (d) {
      return function (ele) {
        return EXPRESSIONS.NOTEQUALS(ele, d[2]);
      };
    }
  },
  {
    name: "DeferedExpComparison$string$5",
    symbols: [{ literal: "<" }, { literal: ">" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "DeferedExpComparison",
    symbols: ["DeferedExpComparison$string$5", "_", "ExpSum"],
    postprocess: function (d) {
      return function (ele) {
        return EXPRESSIONS.NOTEQUALS(ele, d[2]);
      };
    }
  },
  {
    name: "DeferedExpComparison",
    symbols: [{ literal: "=" }, "_", "ExpSum"],
    postprocess: function (d) {
      return function (ele) {
        return EXPRESSIONS.EQUALS(ele, d[2]);
      };
    }
  },
  {
    name: "ExpComparison",
    symbols: ["ExpComparison", "_", { literal: "<" }, "_", "ExpSum"],
    postprocess: function (d) {
      return EXPRESSIONS.COMPARE("<", d[0], d[4]);
    }
  },
  {
    name: "ExpComparison",
    symbols: ["ExpComparison", "_", { literal: ">" }, "_", "ExpSum"],
    postprocess: function (d) {
      return EXPRESSIONS.COMPARE(">", d[0], d[4]);
    }
  },
  {
    name: "ExpComparison$string$1",
    symbols: [{ literal: "<" }, { literal: "=" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "ExpComparison",
    symbols: ["ExpComparison", "_", "ExpComparison$string$1", "_", "ExpSum"],
    postprocess: function (d) {
      return EXPRESSIONS.COMPARE("<=", d[0], d[4]);
    }
  },
  {
    name: "ExpComparison$string$2",
    symbols: [{ literal: ">" }, { literal: "=" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "ExpComparison",
    symbols: ["ExpComparison", "_", "ExpComparison$string$2", "_", "ExpSum"],
    postprocess: function (d) {
      return EXPRESSIONS.COMPARE(">=", d[0], d[4]);
    }
  },
  {
    name: "ExpComparison$string$3",
    symbols: [{ literal: "=" }, { literal: "=" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "ExpComparison",
    symbols: ["ExpComparison", "_", "ExpComparison$string$3", "_", "ExpSum"],
    postprocess: function (d) {
      return EXPRESSIONS.EQUALS(d[0], d[4]);
    }
  },
  {
    name: "ExpComparison$string$4",
    symbols: [{ literal: "!" }, { literal: "=" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "ExpComparison",
    symbols: ["ExpComparison", "_", "ExpComparison$string$4", "_", "ExpSum"],
    postprocess: function (d) {
      return EXPRESSIONS.NOTEQUALS(d[0], d[4]);
    }
  },
  {
    name: "ExpComparison$string$5",
    symbols: [{ literal: "<" }, { literal: ">" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "ExpComparison",
    symbols: ["ExpComparison", "_", "ExpComparison$string$5", "_", "ExpSum"],
    postprocess: function (d) {
      return EXPRESSIONS.NOTEQUALS(d[0], d[4]);
    }
  },
  {
    name: "ExpComparison",
    symbols: ["ExpComparison", "_", { literal: "=" }, "_", "ExpSum"],
    postprocess: function (d) {
      return EXPRESSIONS.EQUALS(d[0], d[4]);
    }
  },
  { name: "ExpComparison", symbols: ["ExpSum"], postprocess: id },
  {
    name: "ExpSum",
    symbols: ["ExpSum", "_", { literal: "+" }, "_", "ExpProduct"],
    postprocess: function (d) {
      return d[0] + d[4];
    }
  },
  {
    name: "ExpSum",
    symbols: ["ExpSum", "_", { literal: "-" }, "_", "ExpProduct"],
    postprocess: function (d) {
      return d[0] - d[4];
    }
  },
  { name: "ExpSum", symbols: ["ExpProduct"], postprocess: id },
  {
    name: "ExpProduct",
    symbols: ["ExpProduct", "_", { literal: "*" }, "_", "ExpUnary"],
    postprocess: function (d) {
      return d[0] * d[4];
    }
  },
  {
    name: "ExpProduct",
    symbols: ["ExpProduct", "_", { literal: "/" }, "_", "ExpUnary"],
    postprocess: function (d) {
      return d[0] / d[4];
    }
  },
  {
    name: "ExpProduct",
    symbols: ["ExpProduct", "_", { literal: "%" }, "_", "ExpUnary"],
    postprocess: function (d) {
      return d[0] % d[4];
    }
  },
  { name: "ExpProduct", symbols: ["ExpUnary"], postprocess: id },
  {
    name: "ExpUnary",
    symbols: [{ literal: "!" }, "_", "ExpPow"],
    postprocess: function (d) {
      return !d[2];
    }
  },
  { name: "ExpUnary", symbols: ["ExpPow"], postprocess: id },
  { name: "ExpPow", symbols: ["Atom"], postprocess: id },
  {
    name: "ExpPow",
    symbols: ["Atom", "_", { literal: "^" }, "_", "ExpPow"],
    postprocess: function (d) {
      return EXPRESSIONS.POW(d[0], d[4]);
    }
  },
  { name: "Atom", symbols: ["NULL"], postprocess: id },
  { name: "Atom", symbols: ["B"], postprocess: id },
  { name: "Atom", symbols: ["Number"], postprocess: id },
  { name: "Atom", symbols: ["Token"], postprocess: id },
  { name: "Atom", symbols: ["String"], postprocess: id },
  { name: "Atom", symbols: ["Parenthesized"], postprocess: id },
  { name: "Atom", symbols: ["Array"], postprocess: id },
  { name: "Atom", symbols: ["ArrayIndex"], postprocess: id },
  { name: "Atom", symbols: ["JSFnCall"], postprocess: id },
  {
    name: "NULL$string$1",
    symbols: [
      { literal: "N" },
      { literal: "U" },
      { literal: "L" },
      { literal: "L" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "NULL",
    symbols: ["NULL$string$1"],
    postprocess: function (d) {
      return null;
    }
  },
  {
    name: "NULL$string$2",
    symbols: [
      { literal: "n" },
      { literal: "u" },
      { literal: "l" },
      { literal: "l" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "NULL",
    symbols: ["NULL$string$2"],
    postprocess: function (d) {
      return null;
    }
  },
  {
    name: "NULL$string$3",
    symbols: [
      { literal: "u" },
      { literal: "n" },
      { literal: "d" },
      { literal: "e" },
      { literal: "f" },
      { literal: "i" },
      { literal: "n" },
      { literal: "e" },
      { literal: "d" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "NULL",
    symbols: ["NULL$string$3"],
    postprocess: function (d) {
      return undefined;
    }
  },
  {
    name: "B$string$1",
    symbols: [
      { literal: "t" },
      { literal: "r" },
      { literal: "u" },
      { literal: "e" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "B",
    symbols: ["B$string$1"],
    postprocess: function (d) {
      return true;
    }
  },
  {
    name: "B$string$2",
    symbols: [
      { literal: "f" },
      { literal: "a" },
      { literal: "l" },
      { literal: "s" },
      { literal: "e" }
    ],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "B",
    symbols: ["B$string$2"],
    postprocess: function (d) {
      return false;
    }
  },
  {
    name: "B$subexpression$1",
    symbols: [/[uU]/, /[pP]/, /[pP]/, /[eE]/, /[rR]/],
    postprocess: function (d) {
      return d.join("");
    }
  },
  {
    name: "B",
    symbols: ["B$subexpression$1"],
    postprocess: function (d) {
      return EXPRESSIONS.UPPER;
    }
  },
  {
    name: "B$subexpression$2",
    symbols: [/[lL]/, /[oO]/, /[wW]/, /[eE]/, /[rR]/],
    postprocess: function (d) {
      return d.join("");
    }
  },
  {
    name: "B",
    symbols: ["B$subexpression$2"],
    postprocess: function (d) {
      return EXPRESSIONS.LOWER;
    }
  },
  {
    name: "B$subexpression$3",
    symbols: [/[sS]/, /[eE]/, /[nN]/, /[tT]/, /[eE]/, /[nN]/, /[cC]/, /[eE]/],
    postprocess: function (d) {
      return d.join("");
    }
  },
  {
    name: "B",
    symbols: ["B$subexpression$3"],
    postprocess: function (d) {
      return EXPRESSIONS.SENTENCE;
    }
  },
  {
    name: "B$subexpression$4",
    symbols: [/[tT]/, /[iI]/, /[tT]/, /[lL]/, /[eE]/],
    postprocess: function (d) {
      return d.join("");
    }
  },
  {
    name: "B",
    symbols: ["B$subexpression$4"],
    postprocess: function (d) {
      return EXPRESSIONS.TITLE;
    }
  },
  { name: "Number$ebnf$1", symbols: [] },
  {
    name: "Number$ebnf$1",
    symbols: ["Number$ebnf$1", /[0-9]/],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "Number",
    symbols: [{ literal: "." }, "Number$ebnf$1"],
    postprocess: function (d) {
      return parseFloat("0." + d[1].join(""), 10);
    }
  },
  { name: "Number", symbols: ["jsonfloat"], postprocess: id },
  { name: "jsonfloat$ebnf$1", symbols: [{ literal: "-" }], postprocess: id },
  {
    name: "jsonfloat$ebnf$1",
    symbols: [],
    postprocess: function (d) {
      return null;
    }
  },
  { name: "jsonfloat$ebnf$2", symbols: [/[0-9]/] },
  {
    name: "jsonfloat$ebnf$2",
    symbols: ["jsonfloat$ebnf$2", /[0-9]/],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  { name: "jsonfloat$ebnf$3$subexpression$1$ebnf$1", symbols: [/[0-9]/] },
  {
    name: "jsonfloat$ebnf$3$subexpression$1$ebnf$1",
    symbols: ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "jsonfloat$ebnf$3$subexpression$1",
    symbols: [{ literal: "." }, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]
  },
  {
    name: "jsonfloat$ebnf$3",
    symbols: ["jsonfloat$ebnf$3$subexpression$1"],
    postprocess: id
  },
  {
    name: "jsonfloat$ebnf$3",
    symbols: [],
    postprocess: function (d) {
      return null;
    }
  },
  {
    name: "jsonfloat$ebnf$4$subexpression$1$ebnf$1",
    symbols: [/[+-]/],
    postprocess: id
  },
  {
    name: "jsonfloat$ebnf$4$subexpression$1$ebnf$1",
    symbols: [],
    postprocess: function (d) {
      return null;
    }
  },
  { name: "jsonfloat$ebnf$4$subexpression$1$ebnf$2", symbols: [/[0-9]/] },
  {
    name: "jsonfloat$ebnf$4$subexpression$1$ebnf$2",
    symbols: ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "jsonfloat$ebnf$4$subexpression$1",
    symbols: [
      /[eE]/,
      "jsonfloat$ebnf$4$subexpression$1$ebnf$1",
      "jsonfloat$ebnf$4$subexpression$1$ebnf$2"
    ]
  },
  {
    name: "jsonfloat$ebnf$4",
    symbols: ["jsonfloat$ebnf$4$subexpression$1"],
    postprocess: id
  },
  {
    name: "jsonfloat$ebnf$4",
    symbols: [],
    postprocess: function (d) {
      return null;
    }
  },
  {
    name: "jsonfloat",
    symbols: [
      "jsonfloat$ebnf$1",
      "jsonfloat$ebnf$2",
      "jsonfloat$ebnf$3",
      "jsonfloat$ebnf$4"
    ],
    postprocess: function (d) {
      return parseFloat(
        (d[0] || "") +
          d[1].join("") +
          (d[2] ? "." + d[2][1].join("") : "") +
          (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
      );
    }
  },
  { name: "String$ebnf$1", symbols: [] },
  {
    name: "String$ebnf$1",
    symbols: ["String$ebnf$1", "dstrchar"],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "String",
    symbols: [{ literal: '"' }, "String$ebnf$1", { literal: '"' }],
    postprocess: function (d) {
      return parseTokensInString(d[1].join(""));
    }
  },
  { name: "String$ebnf$2", symbols: [] },
  {
    name: "String$ebnf$2",
    symbols: ["String$ebnf$2", "sstrchar"],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "String",
    symbols: [{ literal: "'" }, "String$ebnf$2", { literal: "'" }],
    postprocess: function (d) {
      return parseTokensInString(d[1].join(""));
    }
  },
  { name: "dstrchar", symbols: [/[^\\"\n]/], postprocess: id },
  {
    name: "dstrchar",
    symbols: [{ literal: "\\" }, "strescape"],
    postprocess: function (d) {
      return JSON.parse('"' + d.join("") + '"');
    }
  },
  { name: "sstrchar", symbols: [/[^\\'\n]/], postprocess: id },
  {
    name: "sstrchar",
    symbols: [{ literal: "\\" }, "strescape"],
    postprocess: function (d) {
      return JSON.parse('"' + d.join("") + '"');
    }
  },
  {
    name: "sstrchar$string$1",
    symbols: [{ literal: "\\" }, { literal: "'" }],
    postprocess: function joiner(d) {
      return d.join("");
    }
  },
  {
    name: "sstrchar",
    symbols: ["sstrchar$string$1"],
    postprocess: function (d) {
      return "'";
    }
  },
  { name: "strescape", symbols: [/["\\/bfnrt]/], postprocess: id },
  {
    name: "strescape",
    symbols: [
      { literal: "u" },
      /[a-fA-F0-9]/,
      /[a-fA-F0-9]/,
      /[a-fA-F0-9]/,
      /[a-fA-F0-9]/
    ],
    postprocess: function (d) {
      return d.join("");
    }
  },
  { name: "Token$ebnf$1", symbols: [] },
  {
    name: "Token$ebnf$1",
    symbols: ["Token$ebnf$1", /[a-zA-Z0-9|:/\(\)\-\?_\. ]/],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "Token",
    symbols: [{ literal: "%" }, "Token$ebnf$1", { literal: "%" }],
    postprocess: function (d) {
      return resolveToken(d[1].join(""));
    }
  },
  { name: "_$ebnf$1", symbols: [] },
  {
    name: "_$ebnf$1",
    symbols: ["_$ebnf$1", "wschar"],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "_",
    symbols: ["_$ebnf$1"],
    postprocess: function (d) {
      return null;
    }
  },
  { name: "__$ebnf$1", symbols: ["wschar"] },
  {
    name: "__$ebnf$1",
    symbols: ["__$ebnf$1", "wschar"],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  },
  {
    name: "__",
    symbols: ["__$ebnf$1"],
    postprocess: function (d) {
      return null;
    }
  },
  { name: "wschar", symbols: [/[ \t\n\v\f]/], postprocess: id }
];
let ParserStart = "main";
export default { Lexer, ParserRules, ParserStart };
