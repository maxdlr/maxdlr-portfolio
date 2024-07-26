<?php

namespace App\Vue\Model;

class VueDatatableSetting
{
    public function __construct(
        public string $name,
        public array  $values,
        public mixed  $default,
        public string $codeName
    )
    {
    }

    public function getSetting(string $key = null): array|string
    {
        $completeSetting = [
            'name' => $this->name,
            'default' => $this->default,
            'values' => $this->values,
            'codeName' => $this->codeName
        ];

        return match ($key) {
            'name' => $this->name,
            'default' => $this->default,
            'values' => $this->values,
            'codeName' => $this->codeName,
            default => $completeSetting
        };
    }
}