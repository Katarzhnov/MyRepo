<?php
/**
 * Create an Item
 */
class sxNewsletterCreateProcessor extends modObjectCreateProcessor {
	public $objectType = 'sxNewsletter';
	public $classKey = 'sxNewsletter';
	public $languageTopics = array('sendex');
	public $permission = 'new_document';


	/**
	 * @return bool
	 */
	public function beforeSet() {
		$alreadyExists = $this->modx->getObject('sxNewsletter', array(
			'name' => $this->getProperty('name'),
		));
		if ($alreadyExists) {
			$this->modx->error->addField('name', $this->modx->lexicon('sendex_newsletter_err_ae'));
		}

		return !$this->hasErrors();
	}

}

return 'sxNewsletterCreateProcessor';