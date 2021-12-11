<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class VueController extends AbstractController
{
    /**
     * @Route("/", name="home_vue")
     * @Route("/{route}", name="vue_pages", requirements={"route"="^(?!.*_wdt|_profiler).+"})
     */
    public function index()
    {
        return $this->render('app.html.twig', [
        ]);
    }
}
