import { withInstall } from '/@/utils';
import type { ExtractPropTypes } from 'vue';
import button from './src/BasicButton.vue';
import buttonAdd from './src/ButtonAdd.vue';
import buttonAddSub from './src/ButtonAddSub.vue';
import buttonCancel from './src/ButtonCancel.vue';
import buttonEdit from './src/ButtonEdit.vue';
import buttonExport from './src/ButtonExport.vue';
import buttonImport from './src/ButtonImport.vue';
import buttonInfo from './src/ButtonInfo.vue';
import buttonLink from './src/ButtonLink.vue';
import buttonRemove from './src/ButtonRemove.vue';
import buttonRemoveBatch from './src/ButtonRemoveBatch.vue';
import buttonSave from './src/ButtonSave.vue';
import buttonSubmit from './src/ButtonSubmit.vue';
import buttonProgress from './src/workflow/ButtonProgress.vue';
import buttonRevoke from './src/workflow/ButtonRevoke.vue';
import buttonStart from './src/workflow/ButtonStart.vue';
import buttonUpload from './src/ButtonUpload.vue';

import popConfirmButton from './src/PopConfirmButton.vue';

export const Button = withInstall(button);
export const AButtonAdd = withInstall(buttonAdd);
export const AButtonAddSub = withInstall(buttonAddSub);
export const AButtonCancel = withInstall(buttonCancel);
export const AButtonEdit = withInstall(buttonEdit);
export const AButtonExport = withInstall(buttonExport);
export const AButtonImport = withInstall(buttonImport);
export const AButtonInfo = withInstall(buttonInfo);
export const AButtonLink = withInstall(buttonLink);
export const AButtonRemove = withInstall(buttonRemove);
export const AButtonRemoveBatch = withInstall(buttonRemoveBatch);
export const AButtonSave = withInstall(buttonSave);
export const AButtonSubmit = withInstall(buttonSubmit);
export const AButtonUpload = withInstall(buttonUpload);
export const AButtonProgress = withInstall(buttonProgress);
export const AButtonRevoke = withInstall(buttonRevoke);
export const AButtonStart = withInstall(buttonStart);

export const PopConfirmButton = withInstall(popConfirmButton);

import { buttonProps } from './src/props';
export declare type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>;
