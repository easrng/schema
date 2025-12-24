/* eslint-disable */
import * as __typia_transform__validateReport from "typia/lib/internal/_validateReport.js";
import * as __typia_transform__createStandardSchema from "typia/lib/internal/_createStandardSchema.js";
export const typiaValidateSet = (() => {
  const __is = (input) =>
    input instanceof Set &&
    (() => [...input].every((elem) => "number" === typeof elem))();
  let errors;
  let _report;
  return __typia_transform__createStandardSchema._createStandardSchema(
    (input) => {
      if (false === __is(input)) {
        errors = [];
        _report = __typia_transform__validateReport._validateReport(errors);
        ((input, _path, _exceptionable = true) =>
          ((input instanceof Set ||
            _report(true, {
              path: _path + "",
              expected: "Set<number>",
              value: input,
            })) &&
            (() =>
              [...input]
                .map(
                  (elem, _index2) =>
                    "number" === typeof elem ||
                    _report(true, {
                      path: _path + "[" + _index2 + "]",
                      expected: "number",
                      value: elem,
                    })
                )
                .every((flag) => flag))()) ||
          _report(true, {
            path: _path + "",
            expected: "Set<number>",
            value: input,
          }))(input, "$input", true);
        const success = 0 === errors.length;
        return success
          ? {
              success,
              data: input,
            }
          : {
              success,
              errors,
              data: input,
            };
      }
      return {
        success: true,
        data: input,
      };
    }
  );
})();
export const typiaValidateMap = (() => {
  const _io0 = (input) => "string" === typeof input.key;
  const _vo0 = (input, _path, _exceptionable = true) =>
    [
      "string" === typeof input.key ||
        _report(_exceptionable, {
          path: _path + ".key",
          expected: "string",
          value: input.key,
        }),
    ].every((flag) => flag);
  const __is = (input) =>
    input instanceof Map &&
    (() =>
      [...input].every(
        (elem) =>
          Array.isArray(elem) &&
          elem.length === 2 &&
          "object" === typeof elem[0] &&
          null !== elem[0] &&
          _io0(elem[0]) &&
          "number" === typeof elem[1]
      ))();
  let errors;
  let _report;
  return __typia_transform__createStandardSchema._createStandardSchema(
    (input) => {
      if (false === __is(input)) {
        errors = [];
        _report = __typia_transform__validateReport._validateReport(errors);
        ((input, _path, _exceptionable = true) =>
          ((input instanceof Map ||
            _report(true, {
              path: _path + "",
              expected: "Map<__type, number>",
              value: input,
            })) &&
            (() =>
              [...input]
                .map(
                  (elem, _index2) =>
                    ((Array.isArray(elem) ||
                      _report(true, {
                        path: _path + "[" + _index2 + "]",
                        expected: "[__type, number]",
                        value: elem,
                      })) &&
                      (elem.length === 2 ||
                        _report(true, {
                          path: _path + "[" + _index2 + "]",
                          expected: "[__type, number]",
                          value: elem,
                        })) &&
                      [
                        ((("object" === typeof elem[0] && null !== elem[0]) ||
                          _report(true, {
                            path: _path + "[" + _index2 + "][0]",
                            expected: "__type",
                            value: elem[0],
                          })) &&
                          _vo0(
                            elem[0],
                            _path + "[" + _index2 + "][0]",
                            true
                          )) ||
                          _report(true, {
                            path: _path + "[" + _index2 + "][0]",
                            expected: "__type",
                            value: elem[0],
                          }),
                        "number" === typeof elem[1] ||
                          _report(true, {
                            path: _path + "[" + _index2 + "][1]",
                            expected: "number",
                            value: elem[1],
                          }),
                      ].every((flag) => flag)) ||
                    _report(true, {
                      path: _path + "[" + _index2 + "]",
                      expected: "[__type, number]",
                      value: elem,
                    })
                )
                .every((flag) => flag))()) ||
          _report(true, {
            path: _path + "",
            expected: "Map<__type, number>",
            value: input,
          }))(input, "$input", true);
        const success = 0 === errors.length;
        return success
          ? {
              success,
              data: input,
            }
          : {
              success,
              errors,
              data: input,
            };
      }
      return {
        success: true,
        data: input,
      };
    }
  );
})();
