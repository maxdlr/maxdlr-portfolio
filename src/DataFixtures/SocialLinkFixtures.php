<?php

namespace App\DataFixtures;

use App\Entity\SocialLink;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class SocialLinkFixtures extends Fixture
{
    public const SOCIAL_LINKS = [
        [
            'name' => 'Github',
            'icon' => 'github',
            'link' => 'https://www.github.com/maxdlr'
        ],
        [
            'name' => 'Linkedin',
            'icon' => 'linkedin',
            'link' => 'https://www.linkedin.com/in/maximedlr/'
        ],
        [
            'name' => 'StackOverFlow',
            'icon' => 'stack-overflow',
            'link' => 'https://stackoverflow.com/users/21948152/maxdlr'
        ]
    ];

    public function load(ObjectManager $manager): void
    {
        foreach (self::SOCIAL_LINKS as $socialLink) {
            $link = new SocialLink();

            $link
                ->setName($socialLink['name'])
                ->setIcon($socialLink['icon'])
                ->setLink($socialLink['link']);

            $manager->persist($link);
        }

        $manager->flush();
    }
}
