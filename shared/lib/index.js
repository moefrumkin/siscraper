"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alsfjdlchContext = exports.isSear = void 0;
const alsfjdlchContext = (context) => {
    const isArrayOfString = (arr) => (Array.isArray(arr) && arr.every(el => typeof el === "string"));
    return isArrayOfString(context.terms) && isArrayOfString(context.schools) && isArrayOfString(context.departments);
};
exports.alsfjdlchContext = alsfjdlchContext;
//# sourceMappingURL=index.js.map