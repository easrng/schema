import typia from "typia";
export declare const typiaValidateSet: ((
  input: unknown,
) => typia.IValidation<Set<number>>) &
  import("@standard-schema/spec").StandardSchemaV1<Set<number>, Set<number>>;
export declare const typiaValidateMap: ((input: unknown) => typia.IValidation<
  Map<
    {
      key: string;
    },
    number
  >
>) &
  import("@standard-schema/spec").StandardSchemaV1<
    Map<
      {
        key: string;
      },
      number
    >,
    Map<
      {
        key: string;
      },
      number
    >
  >;
