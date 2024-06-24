import { Token, TokenType } from '../tokenizer';
import { Expression, parseExpression } from './expression';
import { expectTokenType } from './parser';

interface ObjectField {
  name: string;
  value: Expression;
}

export interface ObjectDefinition {
  fields: ObjectField[];
}

export const checkIsObjectDefinition = (
  tokens: Token[]
) => {
  if (tokens.length < 2) {
    return false;
  }
  try {
    expectTokenType(tokens[0].type, [TokenType.OpenBrace]);
    expectTokenType(tokens[tokens.length - 1].type, [TokenType.CloseBrace]);

    return true;
  } catch {
    return false;
  }
};

export const parseObjectDefinition = (tokens: Token[]): ObjectDefinition => {
  const objectDefinition: ObjectDefinition = {
    fields: [],
  };
  let parsingFieldName = true;
  let fieldNameBuffer = '';
  let nestedCloseBraceIndex = 0;
  let valueBuffer: Token[] = [];

  const finishField = () => {
    objectDefinition.fields.push({
      name: fieldNameBuffer,
      value: parseExpression(valueBuffer)
    });
    valueBuffer = [];
    parsingFieldName = true;
  };

  tokens.slice(2, tokens.length - 1).forEach((token, index) => {
    if (parsingFieldName) {
      if (token.type === TokenType.NewLine) {
        return;
      }
      expectTokenType(token.type, [TokenType.Name]);
      fieldNameBuffer = token.stringView;
      parsingFieldName = false;
      return;
    }
    if (token.type === TokenType.Colon) {
      return;
    }
    if (token.type === TokenType.NewLine && !nestedCloseBraceIndex) {
      finishField();
      return;
    }
    if (token.type === TokenType.OpenBrace) {
      valueBuffer.push(token);
      nestedCloseBraceIndex++;
      if (nestedCloseBraceIndex === 1) {
        return;
      }
    }
    if (token.type === TokenType.CloseBrace) {
      nestedCloseBraceIndex--;
      if (nestedCloseBraceIndex !== 0) {
        return;
      }
      valueBuffer.push(token);
      finishField();
      return;
    }
    valueBuffer.push(token);
  });
  return objectDefinition;
};
