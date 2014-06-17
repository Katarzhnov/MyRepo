<?php
/**
 * Remove an Items
 */
class SendexItemsRemoveProcessor extends modProcessor {
    public $checkRemovePermission = true;
	public $objectType = 'SendexItem';
	public $classKey = 'SendexItem';
	public $languageTopics = array('sendex');

	public function process() {

        foreach (explode(',',$this->getProperty('items')) as $id) {
            $item = $this->modx->getObject($this->classKey, $id);
            $item->remove();
        }
        
        return $this->success();

	}

}

return 'SendexItemsRemoveProcessor';