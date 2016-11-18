import {InsertOneWriteOpResult} from 'mongodb';

/**
 * Mapping insert result to the inserted document to return on query
 * @param result: InsertOneWriteOpResult
 * @returns doc inserted or undefined.
 */
export function extractInsertResult(result: InsertOneWriteOpResult): any {
  return result && result.ops && result.ops[0]
}
