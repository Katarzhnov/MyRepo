<?php
/**
 * Update an Item
 */
class sxNewsletterUpdateProcessor extends modObjectUpdateProcessor {
	public $objectType = 'sxNewsletter';
	public $classKey = 'sxNewsletter';
	public $languageTopics = array('sendex');
	public $permission = 'edit_document';
}

return 'sxNewsletterUpdateProcessor';
