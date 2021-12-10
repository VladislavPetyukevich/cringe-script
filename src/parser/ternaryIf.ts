import { Token, TokenType } from '../tokenizer';
import { parse, TernaryIfExpression } from './parser';

export const parseTernaryIf = (tokens: Token[]): TernaryIfExpression => {
  const questionIndex = tokens.findIndex(token => token.type === TokenType.QuestionMark);
  if (questionIndex === -1) {
    throw new Error('Question mark not found');
  }
  const colonIndex = tokens.findIndex(token => token.type === TokenType.Colon);
  if (colonIndex === -1) {
    throw new Error('Colon not found');
  }
  const conditionTokens = tokens.slice(0, questionIndex);
  const statementTrueTokens = tokens.slice(questionIndex + 1, colonIndex);
  const statementFalseTokens = tokens.slice(colonIndex + 1, tokens.length + 1);
  const statementCondition = parse(conditionTokens);
  const statementTrue = parse(statementTrueTokens);
  const statementFalse = parse(statementFalseTokens);
  return {
    condition: statementCondition,
    statementTrue: statementTrue,
    statementFalse: statementFalse,
  };
};

export const findIndexOfTernaryIfExpression = (tokens: Token[]) => {
  const questionMarkIndex = tokens.findIndex(token => token.type === TokenType.QuestionMark);
  const colonIndexIndex = tokens.findIndex(token => token.type === TokenType.Colon);
  if (
    (questionMarkIndex === -1) ||
    (questionMarkIndex === 0) ||
    (colonIndexIndex === -1)
  ) {
    return -1;
  }
  if (colonIndexIndex < questionMarkIndex) {
    return -1;
  }
  return questionMarkIndex;
};
