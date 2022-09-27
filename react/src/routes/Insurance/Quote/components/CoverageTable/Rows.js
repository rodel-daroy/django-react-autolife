import React from "react";
import LabelWithInfo from "../../../../../components/Forms/LabelWithInfo";

export const COMPREHENSIVE_DEDUCTIBLE = {
  name: "Comprehensive deductible",
  shortName: "Comprehensive deductible",
  description:
    "Comprehensive coverage provides protection to the vehicle when it sustains damages other than those described under Collision coverage. Namely: fire; theft; lightening, windstorm, hail, rising water or earthquake; explosion; riot or civil disturbance; falling or forced landing of aircraft or parts of aircraft; stranding, sinking, burning, derailment or collision of any kind in, or upon, which the vehicle is being transported; falling or flying objects; and vandalism. Your deductible is the amount you agree to pay toward the repair or replacement of the vehicle. Choosing a higher deductible will, in most cases, lower the premium."
};

export const COLLISION_DEDUCTIBLE = {
  name: "Collision deductible",
  shortName: "Collision deductible",
  description:
    "Collision coverage provides protection to the vehicle when it is involved in a collision with another vehicle or object, or is tipped over. Your deductible is the amount you agree to pay toward the repair or replacement of the vehicle. Choosing a higher deductible will, in most cases, lower the premium."
};

export const LIABILITY_LIMIT = {
  name: "Liability limit",
  shortName: "Liability limit",
  description:
    "Provides coverage for you or other insured persons if someone else is injured or their property is damaged in an automobile accident. It will also pay for legitimate claims against you or other insured persons up to the limit of your coverage, and the cost of settling claims. Choosing a lower liability amount will, in most cases, lower the premium; remember however, that this will also lower the protection."
};

export const INCOME_REPLACEMENT = {
  name: "Income replacement",
  shortName: "Income replacement",
  description:
    "Provides coverage for you or other insured persons if someone else is injured or their property is damaged in an automobile accident. It will also pay for legitimate claims against you or other insured persons up to the limit of your coverage, and the cost of settling claims. Choosing a lower liability amount will, in most cases, lower the premium; remember however, that this will also lower the protection."
};

export const INCREASED_CARE = {
  name: "Increased care",
  shortName: "Increased care",
  description:
    "Provides coverage for you or other insured persons if someone else is injured or their property is damaged in an automobile accident. It will also pay for legitimate claims against you or other insured persons up to the limit of your coverage, and the cost of settling claims. Choosing a lower liability amount will, in most cases, lower the premium; remember however, that this will also lower the protection."
};

export const LOSS_OF_USE = {
  name: "Loss of use",
  shortName: "Loss of use",
  description:
    'This coverage is provided by an endorsement normally called the "OPCF 20". It provides for you to rent a replacement car if your own car is damaged in an accident that is your fault or partially your fault, or as a result of any of the insured perils (i.e. fire, vandalism etc). Coverage may also include the cost for taxis, rental vehicles or public transportation. Note that this coverage generally provides a limit of up to $900.'
};

export const NON_OWNED_AUTO = {
  name: "Non-owned auto",
  shortName: "Non-owned auto",
  description:
    'This coverage is provided by an endorsement called "OPCF 27". It extends whatever Collision, Comprehensive, or All Perils coverage you have purchased for your own car to a rental car or other non-owned car for which you have accepted responsibility under a written contract. Note that because there must be a written contract, coverage does not extend to borrowed cars AND there is normally a coverage limit of $40,000 (Canadian dollars) and your deductible will apply.'
};

export const WAIVER_OF_DEPRECIATION = {
  name: "Waiver of depreciation",
  shortName: "Waiver of depreciation",
  description:
    "This coverage is recommended for people who rent cars while traveling if they want to avoid having to pay the daily insurance premium charged by the car rental company which can be quite expensive. However, this endorsement only applies in Canada and the United States. Also note that this coverage will only respond if the original insured vehicle is parked and not in use by anyone."
};

export const ACCIDENT_FORGIVENESS = {
  name: "Accident forgiveness",
  shortName: "Accident forgiveness",
  description:
    "Accident forgiveness will prevent your driving record from being affected by one at-fault accident"
};

export const ACCIDENT_BENEFITS = {
  name: "Accident benefits",
  shortName: "Accident benefits",
  description:
    "Additional accident benefit choices will allow you to customize your policy to suit your needs. These choices will give you greater influence over the price you pay for insurance. Pricing will vary based on the benefits you purchase. If you select 'Standard', your quote will include only the minimum standard accident benefit coverage."
};

export const IMPAIR_COVERAGES = {
  name: "Impair coverages",
  shortName: "Impair coverages",
  description:
    "Additional accident benefit choices will allow you to customize your policy to suit your needs. These choices will give you greater influence over the price you pay for insurance. Pricing will vary based on the benefits you purchase. If you select 'Standard', your quote will include only the minimum standard accident benefit coverage."
};

export const DEATH_FUNERAL = {
  name: "Death funeral",
  shortName: "Death funeral",
  description:
    "Additional accident benefit choices will allow you to customize your policy to suit your needs. These choices will give you greater influence over the price you pay for insurance. Pricing will vary based on the benefits you purchase. If you select 'Standard', your quote will include only the minimum standard accident benefit coverage."
};

export const DEPENDENT_CARE = {
  name: "Dependent care",
  shortName: "Dependent care",
  description:
    "Additional accident benefit choices will allow you to customize your policy to suit your needs. These choices will give you greater influence over the price you pay for insurance. Pricing will vary based on the benefits you purchase. If you select 'Standard', your quote will include only the minimum standard accident benefit coverage."
};

export const INDEXATION_BENEFIT = {
  name: "Indexation benefit",
  shortName: "Indexation benefit",
  description:
    "Additional accident benefit choices will allow you to customize your policy to suit your needs. These choices will give you greater influence over the price you pay for insurance. Pricing will vary based on the benefits you purchase. If you select 'Standard', your quote will include only the minimum standard accident benefit coverage."
};

export const OFFSET_TORT_DEDUCTIBLE = {
  name: "Offset tort deductible",
  shortName: "Offset tort deductible",
  description:
    "Additional accident benefit choices will allow you to customize your policy to suit your needs. These choices will give you greater influence over the price you pay for insurance. Pricing will vary based on the benefits you purchase. If you select 'Standard', your quote will include only the minimum standard accident benefit coverage."
};

export const INCREASED_CARE_INJURIES = {
  name: "Increased care injuries",
  shortName: "Increased care injuries",
  description:
    "Additional accident benefit choices will allow you to customize your policy to suit your needs. These choices will give you greater influence over the price you pay for insurance. Pricing will vary based on the benefits you purchase. If you select 'Standard', your quote will include only the minimum standard accident benefit coverage."
};

export const RowLabel = ({ name, shortName, description, htmlFor }) => (
  <label htmlFor={htmlFor}>
    {description && (
      <LabelWithInfo title={name} content={description} infoPosition="left">
        {name}
      </LabelWithInfo>
    )}

    {!description && <label>{name}</label>}
  </label>
);
