import { ApiProperty } from '@nestjs/swagger';

export class InputValidationError {
  @ApiProperty({
    example: 'parentField1',
  })
  field: string;

  @ApiProperty({
    example: 'abcd',
  })
  value: string;

  @ApiProperty({
    example: {
      isLength: 'parentField1 should be longer than or equal to 5 characters',
    },
  })
  constraints: { [constraint: string]: string };

  @ApiProperty({
    isArray: true,
    type: InputValidationError,
    example: [
      {
        field: 'nestedField1',
        value: '',
        constraints: {
          isNotEmpty: 'nestedField1 should not be empty',
        },
      },
    ],
  })
  children: InputValidationError[];

  constructor(field: string, value: string, constraints: any, children: InputValidationError[] = []) {
    this.field = field;
    this.value = value;
    this.constraints = constraints;
    this.children = children;
  }
}
