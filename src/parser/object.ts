import { Token, TokenType } from '../tokenizer';
import { ObjectDefenitionExpression, ObjectParserFields, parse } from './parser';

export interface ObjectFieldsParserState {
  fields: ObjectParserFields[];
  bufferName: string;
  bufferValue: Token[];
  nestedCloseBraceIndex: number;
  isParsingFieldValue: boolean;
}

export const parseObjectDefenition = (tokens: Token[]): ObjectDefenitionExpression => {
  const bodyTokens = tokens.slice(2, tokens.length - 1);
  const objectData = parseObjectFields(bodyTokens);
  return {
    fields: objectData.fields
  };
};

export const parseObjectFields = (tokens: Token[]): ObjectFieldsParserState => {
  const objectFieldsParserStateInitial =
    { fields: [], bufferName: '', bufferValue: [], nestedCloseBraceIndex: 0, isParsingFieldValue: false }
  const objectFieldsParserState =
    tokens.reduce((accum: ObjectFieldsParserState, token, index): ObjectFieldsParserState => {
      if (index < accum.nestedCloseBraceIndex) {
        return accum;
      }
      if (token.type === TokenType.Colon) {
        return {
          ...accum,
          isParsingFieldValue: true
        };
      }
      if (token.type === TokenType.NewLine) {
        return {
          ...accum,
          fields: [
            ...accum.fields,
            { name: accum.bufferName, value: parse(accum.bufferValue)[0] }
          ],
          isParsingFieldValue: false,
          bufferName: '',
          bufferValue: []
        };
      }
      if (token.type === TokenType.OpenBrace) {
        let braceOpenedCount = 0;
        const closeBraceIndex = tokens.findIndex(
          (token, nestedIndex) => {
            if (token.type === TokenType.OpenBrace) {
              braceOpenedCount++;
            } else if (token.type === TokenType.CloseBrace) {
              braceOpenedCount--;
            }
            const isCloseBrace = token.type === TokenType.CloseBrace;
            const isAfterNestedIndex = nestedIndex > index;
            const isRootBraceClosed = braceOpenedCount === 0;
            return isCloseBrace && isAfterNestedIndex && isRootBraceClosed;
          }
        );
        if (closeBraceIndex === -1) {
          throw new Error('Close Brace not found in nested object');
        }
        const nestedObjectTokens = tokens.slice(index + 2, closeBraceIndex);
        const nestedObjectFields = parseObjectFields(nestedObjectTokens);
        return {
          ...accum,
          fields: [
            ...accum.fields,
            { name: accum.bufferName, value: nestedObjectFields }
          ],
          nestedCloseBraceIndex: closeBraceIndex + 2,
          isParsingFieldValue: false,
          bufferName: '',
          bufferValue: []
        };
      }
      if (accum.isParsingFieldValue) {
        return {
          ...accum,
          bufferValue: [
            ...accum.bufferValue,
            token
          ]
        };
      }
      return {
        ...accum,
        bufferName: token.stringView
      };
    }, objectFieldsParserStateInitial);
    if (
      (objectFieldsParserState.bufferName !== objectFieldsParserStateInitial.bufferName) ||
      (objectFieldsParserState.isParsingFieldValue !== objectFieldsParserStateInitial.isParsingFieldValue) ||
      (objectFieldsParserState.bufferValue.length !== objectFieldsParserStateInitial.bufferValue.length)
    ) {
      throw new Error('Error while parsing object');
    }
    return objectFieldsParserState;
};

export const findIndexOfObjectExpression = (tokens: Token[]) => {
  // TODO: Improve logic here
  const openBraceIndex = tokens.findIndex(token => token.type === TokenType.OpenBrace);
  const closeBraceIndex = tokens.findIndex(token => token.type === TokenType.CloseBrace);
  const colonIndex = tokens.findIndex(token => token.type === TokenType.Colon);
  if (
    (openBraceIndex === -1) ||
    (closeBraceIndex === -1) ||
    (colonIndex === -1)
  ) {
    return -1;
  }
  const isColonNextToOpenBrace = openBraceIndex < colonIndex;
  const isCloseBraceNextToColon = colonIndex < closeBraceIndex;
  if (!isColonNextToOpenBrace || !isCloseBraceNextToColon) {
    return -1;
  }
  return openBraceIndex;
};
