<?php

namespace App\Vue;

use App\Entity\SocialLink;
use App\Service\ClassBrowser;
use Doctrine\Common\Collections\Collection;
use ReflectionException;
use ReflectionMethod;
use ReflectionProperty;
use function Symfony\Component\String\u;

class VueObjectMaker
{
    private static array $vueObject = [];

    /**
     * @throws ReflectionException
     */
    public static function makeVueObjectOf(array $entities, ?array $properties = null): static
    {
        self::$vueObject = array_map(function (object $object) use ($entities, $properties) {
            return self::makeVueObject($object, $properties);
        }, $entities);

        return new static;
    }

    /**
     * @throws ReflectionException
     */
    private static function makeVueObject(object $object, ?array $properties = null): array
    {
        $vueObject = [];
        $objectFqcn = u(get_class($object))->trimPrefix('Proxies\\__CG__\\')->toString();
        $allProperties = ClassBrowser::findAllProperties($objectFqcn);

        if ($properties === null) {
            $properties = array_map(function(ReflectionProperty $property) {
                return $property->getName();
            }, $allProperties);
        }

        foreach ($allProperties as $property) {
            if (in_array($property->getName(), $properties)) {
                $getter = self::findGetterMethod($objectFqcn, $property->getName());
                $value = $object->{$getter->getName()}();
                $vueObject[$property->getName()] = self::formatValue($value);
            }
        }

        return self::sortVueObject($vueObject, $properties);
    }

    /**
     * @throws ReflectionException
     */
    private static function findGetterMethod(string $objectFqcn, string $propertyName): ReflectionMethod
    {
        $getter = ClassBrowser::findGetter($objectFqcn, $propertyName);
        assert($getter instanceof ReflectionMethod);
        return $getter;
    }

    /**
     * @throws ReflectionException
     */
    private static function formatValue(mixed $value): mixed
    {
        return match (true) {
            $value instanceof SocialLink => ['id' => $value->getId(), 'value' => $value->getName()],
            $value instanceof Collection => self::formatCollection($value),
            default => $value
        };
    }

    /**
     * @throws ReflectionException
     */
    private static function formatCollection(Collection $collection): array
    {
        return array_map(function ($object) {
            $collectionProperty = self::getCollectionProperty($object);
            return self::makeVueObject($object, $collectionProperty);
        }, $collection->toArray());
    }

    private static function getCollectionProperty(object $object): ?array
    {
//        return match (true) {
//            default => null
//        };
        return null;
    }

    private static function sortVueObject(array $vueObject, array $properties): array
    {
        $sortedVueObject = [];
        foreach ($properties as $property) {
            $sortedVueObject[$property] = $vueObject[$property];
        }
        return $sortedVueObject;
    }

    public function regroup(string $property): static
    {
        self::$vueObject = array_unique(
            array_map(fn(array $object) => $object[$property], self::$vueObject), SORT_REGULAR
        );
        sort(self::$vueObject);
        return new static;
    }

    public function get(): array
    {
        return self::$vueObject;
    }
}
