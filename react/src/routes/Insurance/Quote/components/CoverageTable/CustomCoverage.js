import React from "react";
import { Field } from "redux-form";
import { ReduxRadioButtonGroup } from "../../../../../components/Forms/RadioButtonGroup";
import { ReduxDropdownField } from "../../../../../components/Forms/DropdownField";
import {
  RowLabel,
  COMPREHENSIVE_DEDUCTIBLE,
  COLLISION_DEDUCTIBLE,
  LIABILITY_LIMIT,
  INCOME_REPLACEMENT,
  INCREASED_CARE,
  LOSS_OF_USE,
  NON_OWNED_AUTO,
  WAIVER_OF_DEPRECIATION,
  ACCIDENT_FORGIVENESS,
  ACCIDENT_BENEFITS,
  IMPAIR_COVERAGES,
  DEATH_FUNERAL,
  DEPENDENT_CARE,
  INDEXATION_BENEFIT,
  OFFSET_TORT_DEDUCTIBLE,
  INCREASED_CARE_INJURIES
} from "./Rows";
import { required } from "../../../../../utils/validations";
import {
  yesNoOptions,
  comprehensiveDeductible,
  liablityLimit,
  increaseCare,
  incomeReplacement
} from "./../InsuranceOptions";

const customAverageOption = [
  { row: LOSS_OF_USE, fieldName: "loss_of_use" },
  { row: NON_OWNED_AUTO, fieldName: "non_owned_auto" },
  { row: WAIVER_OF_DEPRECIATION, fieldName: "waiver_depreciation" },
  { row: ACCIDENT_FORGIVENESS, fieldName: "accident_forgiveness" },
  { row: ACCIDENT_BENEFITS, fieldName: "accident_benefits" },
  { row: IMPAIR_COVERAGES, fieldName: "impair_coverages" },
  { row: DEATH_FUNERAL, fieldName: "death_funeral" },
  { row: DEPENDENT_CARE, fieldName: "dependant_care" },
  { row: INDEXATION_BENEFIT, fieldName: "indexation_benefit" },
  { row: OFFSET_TORT_DEDUCTIBLE, fieldName: "offset_tort_ded" },
  { row: INCREASED_CARE_INJURIES, fieldName: "increased_care_injuries" }
];

const CustomCoverage = () => (
  <div className="coverageTable">
    <table className="table table-bordered">
      <tbody>
        <tr>
          <th scope="row">
            <RowLabel
              {...COMPREHENSIVE_DEDUCTIBLE}
              htmlFor="comprehensive_deductible-field"
            />
          </th>
          <td>
            <div>
              <Field
                id="comprehensive_deductible-field"
                name="comprehensive_deductible"
                shortLabel="Comprehensive deductible"
                validate={[required]}
                component={ReduxDropdownField}
                options={comprehensiveDeductible}
              />
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <RowLabel
              {...COLLISION_DEDUCTIBLE}
              htmlFor="collision_deductible-field"
            />
          </th>
          <td>
            <div>
              <Field
                id="collision_deductible-field"
                name="collision_deductible"
                shortLabel="Collision deductible"
                validate={[required]}
                component={ReduxDropdownField}
                options={comprehensiveDeductible}
              />
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <RowLabel {...LIABILITY_LIMIT} htmlFor="liability_limit-field" />
          </th>
          <td>
            <div>
              <Field
                id="liability_limit-field"
                name="liability_limit"
                shortLabel="Liability limit"
                validate={[required]}
                component={ReduxDropdownField}
                options={liablityLimit}
              />
            </div>
          </td>
        </tr>
        {customAverageOption.map((options, i) => (
          <tr key={i}>
            <th scope="row">
              <RowLabel
                {...options.row}
                htmlFor={`${options.fieldName}-field`}
              />
            </th>
            <td>
              <div>
                <Field
                  id={`${options.fieldName}-field`}
                  name={options.fieldName}
                  shortLabel={options.row.shortName}
                  component={ReduxRadioButtonGroup}
                  options={yesNoOptions}
                  validate={[required]}
                />
              </div>
            </td>
          </tr>
        ))}
        <tr>
          <th scope="row">
            <RowLabel
              {...INCOME_REPLACEMENT}
              htmlFor="income_replacement-field"
            />
          </th>
          <td>
            <div>
              <Field
                id="income_replacement-field"
                name="income_replacement"
                shortLabel="Income replacement"
                validate={[required]}
                component={ReduxDropdownField}
                options={incomeReplacement}
              />
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <RowLabel {...INCREASED_CARE} htmlFor="increased_care-field" />
          </th>
          <td>
            <div>
              <Field
                id="increased_care-field"
                name="increased_care"
                shortLabel="Increased care"
                validate={[required]}
                component={ReduxDropdownField}
                options={increaseCare}
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default CustomCoverage;
