<?php

namespace App\Vue\Model;

class VueDatatable
{
    /**
     * @param VueDatatableSetting[] $settings
     * @param array $items
     */
    public function __construct(
        public array $settings,
        public array $items
    )
    {
    }

    public function getAsVueObject(): array
    {
        return [
            'settings' => $this->settings,
            'items' => $this->items
        ];
    }
}