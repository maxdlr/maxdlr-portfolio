<?php

namespace App\Vue;

use App\Vue\Model\VueDatatable;
use App\Vue\Model\VueDatatableComponent;
use App\Vue\Model\VueDatatableSetting;
use Exception;

class VueFormatter
{
    /**
     * @throws Exception
     */
    public static function createDatatableComponent(
        string $name,
        string $component,
        array  $settings,
        array  $items
    ): VueDatatableComponent
    {
        return new VueDatatableComponent(
            name: $name,
            component: $component,
            datatable: self::createDatatable(
                settings: $settings,
                items: $items
            )
        );
    }

    public static function createDatatable(
        array $settings,
        array $items
    ): VueDatatable
    {
        return new VueDatatable(
            settings: self::constructSettings($settings),
            items: $items
        );
    }

    private static function constructSettings(array $settings): array
    {
        foreach ($settings as $setting) {
            assert($setting instanceof VueDatatableSetting);
        }

        $formattedSettings = [];
        foreach ($settings as $setting) {
            assert($setting instanceof VueDatatableSetting);
            $formattedSettings[$setting->getSetting('codeName')] = $setting->getSetting();
        }
        return $formattedSettings;
    }
}