<?php

namespace App\Vue\Model;

use App\Service\Explorer;
use Exception;

class VueDatatableComponent
{
    /**
     * @param string $name
     * @param string $component
     * @param VueDatatable $datatable
     *
     * @throws Exception
     */
    public function __construct(
        public string       $name,
        public string       $component,
        public VueDatatable $datatable
    )
    {
        self::validateIsVueComponent($this->component);
    }

    /**
     * @throws Exception
     */
    private static function validateIsVueComponent(string $componentName): void
    {
        if (false === in_array($componentName, Explorer::findFileNames('../assets/vue', 'vue'))) {
            throw new Exception('Unable to find vue component:' . $componentName);
        }
    }

    public function getAsVueObject(): array
    {
        return [
            'name' => $this->name,
            'component' => $this->component,
            'data' => $this->datatable->getAsVueObject(),
        ];
    }
}