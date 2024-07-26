<?php

namespace App\Controller;

use App\Repository\SocialLinkRepository;
use App\Vue\VueObjectMaker;
use ReflectionException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    public function __construct(
        public SocialLinkRepository $socialLinkRepository
    )
    {
    }

    /**
     * @throws ReflectionException
     */
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        $socialLinkObjects = $this->socialLinkRepository->findAll();
        $socialLinks = VueObjectMaker::makeVueObjectOf($socialLinkObjects)->get();

        return $this->render('home/index.html.twig', [
            'socialLinks' => $socialLinks,
        ]);
    }
}
