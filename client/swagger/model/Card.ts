/**
 * LearnIt
 * Temporal Api for LearnIt.
 *
 * OpenAPI spec version: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import * as models from './models';

export interface Card {
    id: string;

    topicId: string;

    bundleId: string;

    languageId: string;

    frontSide: string;

    backSide: string;

    reverseable?: boolean;

    level?: number;

    nextTimeInverse?: boolean;

    customCard?: boolean;

    dueDate?: number;

}