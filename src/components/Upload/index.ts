import { withInstall } from '/@/utils';
import basicUpload from './basic/BasicUpload.vue';
import ruleUpload from './basic/RuleUpload.vue';

export const BasicUpload = withInstall(basicUpload);
export const RuleUpload = withInstall(ruleUpload);
