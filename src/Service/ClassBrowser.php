<?php

namespace App\Service;

use Doctrine\ORM\Mapping\Entity;
use Exception;
use ReflectionAttribute;
use ReflectionClass;
use ReflectionException;
use ReflectionMethod;
use ReflectionNamedType;

use ReflectionProperty;

use function Symfony\Component\String\u;

class ClassBrowser
{
    /**
     * @throws ReflectionException
     * @throws Exception
     */
    public static function findAllProperties(string $classFQCN): array
    {
        $reflection = new ReflectionClass($classFQCN);
        $properties = [];

        try {
            foreach ($reflection->getProperties() as $property) {
                $properties[] = $property;
            }

            return $properties;
        } catch (Exception) {
            throw new Exception('Cannot find ' . $classFQCN . '.');
        }
    }

    /**
     * @throws ReflectionException
     */
    public static function findProperty(string $classFQCN, string $search): ?ReflectionProperty
    {
        foreach (self::findAllProperties($classFQCN) as $property) {
            assert($property instanceof ReflectionProperty);
            if ($property->name === $search) {
                return $property;
            }
        }

        return null;
    }

    /**
     * @throws ReflectionException
     */
    public static function propertyExists(
        string $classFQCN,
        string $property
    ): bool
    {
        $haystack = array_map(fn(ReflectionProperty $property) => $property->name, self::findAllProperties($classFQCN));

        return in_array($property, $haystack);
    }

    /**
     * @throws ReflectionException
     */
    public static function isPropertyPublic(
        string $classFQCN,
        string $search,
    ): bool
    {
        return self::findProperty($classFQCN, $search)->isPublic();
    }

    /**
     * @throws ReflectionException
     */
    public static function findSetter(
        string $classFQCN,
        string $property
    ): ?ReflectionMethod
    {
        return self::findMethod($classFQCN, $property, 'set');
    }

    /**
     * @throws ReflectionException
     */
    public static function findGetter(
        string $classFQCN,
        string $property
    ): ?ReflectionMethod
    {
        return self::findMethod($classFQCN, $property, 'get');
    }

    /**
     * @throws ReflectionException
     * @throws Exception
     */
    public static function findMethod(
        string  $classFQCN,
        string  $search,
        ?string $methodPrefix = null
    ): ?ReflectionMethod
    {
        $reflection = new ReflectionClass($classFQCN);
        $needleMethod = $methodPrefix ? $methodPrefix . u($search)->title()->toString() : $search;

        try {
            foreach ($reflection->getMethods() as $method) {
                if (strchr($method->name, $needleMethod)) {
                    return $method;
                }
            }
        } catch (Exception) {
            throw new Exception('Cannot find ' . $needleMethod . ' in ' . $classFQCN . '.');
        }

        return null;
    }

    /**
     * @throws ReflectionException
     * @throws Exception
     */
    public static function findMethodReturnType(
        string $classFQCN,
        string $search
    ): ?ReflectionNamedType
    {
        $type = self::findMethod($classFQCN, $search)?->getReturnType();
        assert($type instanceof ReflectionNamedType);

        return $type;
    }

    public static function findPropertyType(
        ReflectionProperty $reflectionProperty
    ): ReflectionNamedType
    {
        $type = $reflectionProperty->getType();
        assert($type instanceof ReflectionNamedType);

        return $type;
    }

    /**
     * @throws ReflectionException
     */
    public static function hasPropertySetter(
        string $classFQCN,
        string $property
    ): bool
    {
        return !is_null(self::findSetter($classFQCN, $property)?->name);
    }

    /**
     * @throws Exception
     */
    public static function findAttribute(string $classFQCN, string $searchFQCN): ?ReflectionAttribute
    {
        try {
            $reflection = new ReflectionClass($classFQCN);
            foreach ($reflection->getAttributes() as $attribute) {
                if ($attribute->getName() === $searchFQCN) {
                    return $attribute;
                }
            }
        } catch (Exception) {
            throw new Exception('Cannot find attribute ' . $searchFQCN . ' in ' . $classFQCN . '.');
        }

        return null;
    }

    /**
     * @throws ReflectionException
     */
    public static function findConstructor(string $classFQCN): ReflectionMethod
    {
        return self::findMethod($classFQCN, '_construct');
    }

    /**
     * @throws ReflectionException
     * @throws Exception
     */
    public static function instantiateWithoutConstructor(string $classFQCN): object
    {
        $reflection = new ReflectionClass($classFQCN);

        if (!$reflection->isInstantiable()) {
            throw new Exception('Object ' . $classFQCN . ' is not instantiable.');
        }
        return $reflection->newInstance();
    }

    /**
     * @throws ReflectionException
     */
    public static function isEntity(string $classFQCN): bool
    {
        $reflection = new ReflectionClass($classFQCN);

        return $reflection->getAttributes(Entity::class) !== [];
    }

    public static function isPropertyRelational(ReflectionProperty $property): bool
    {
        foreach ($property->getAttributes() as $attribute) {
            if (u($attribute->getName())->containsAny(['OneToMany', 'OneToOne', 'ManyToOne', 'ManyToMany']))
                return true;
        }
        return false;
    }

    /**
     * @param ReflectionProperty[]|ReflectionMethod[]|ReflectionAttribute[]|ReflectionNamedType[]|ReflectionClass[] $reflectionObjects
     * @return string[]
     */
    public static function getNames(array $reflectionObjects): array
    {
        $names = [];
        foreach ($reflectionObjects as $object) {
            $names[] = $object->getName();
        }
        return $names;
    }

    /**
     * @throws ReflectionException
     */
    public static function isPropertyNullable(ReflectionProperty|string $reflectionProperty, string $classFQCN = null): bool
    {
        if (is_string($reflectionProperty)) {
            $reflection = new ReflectionClass($classFQCN);
            $property = $reflection->getProperty($reflectionProperty);
            $type = $property->getType();
        } else {
            $type = $reflectionProperty->getType();
        }

        assert($type instanceof ReflectionNamedType);
        return $type->allowsNull();
    }
}
