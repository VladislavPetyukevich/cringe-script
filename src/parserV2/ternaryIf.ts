import { Token, TokenType } from '../tokenizer';
import { Expression, parseExpression } from './expression';

export interface TernaryIf {
  condition: Expression;
  trueBranch: Expression;
  falseBranch: Expression;
};

export const checkIsTernaryIf = (tokens: Token[]) => {
  const questionMarkIndex = tokens.findIndex(
    token => token.type === TokenType.QuestionMark
  );
  if (questionMarkIndex === -1) {
    return false;
  }
  const colonIndex = tokens.findIndex(
    token => token.type === TokenType.Colon
  );
  if (colonIndex === -1) {
    return false;
  }
  if (colonIndex < questionMarkIndex) {
    return false;
  }
  return true;
};

type ParseStage =
  'Condition' |
  'TrueBranch' |
  'FalseBranch';

export const parseTernaryIf = (tokens: Token[]): TernaryIf => {
  let parseStage: ParseStage = 'Condition';
  let nestedLevel = 0;
  const conditionTokens: Token[] = [];
  const trueBranchTokens: Token[] = [];
  const falseBranchTokens: Token[] = [];
  tokens.forEach(token => {
    if (parseStage !== 'Condition' && token.type === TokenType.QuestionMark) {
      nestedLevel++;
    }
    switch (parseStage) {
      case 'Condition':
        if (token.type === TokenType.QuestionMark) {
          parseStage = 'TrueBranch';
          return;
        }
        conditionTokens.push(token);
        break;
      case 'TrueBranch':
        if (token.type === TokenType.Colon) {
          if (nestedLevel) {
            nestedLevel--;
            trueBranchTokens.push(token);
            return;
          }
          parseStage = 'FalseBranch';
          return;
        }
        trueBranchTokens.push(token);
        break;
      case 'FalseBranch':
        falseBranchTokens.push(token);
        break;
      default:
        break;
    }
  });

  return {
    condition: parseExpression(conditionTokens),
    trueBranch: parseExpression(trueBranchTokens),
    falseBranch: parseExpression(falseBranchTokens),
  }
};
