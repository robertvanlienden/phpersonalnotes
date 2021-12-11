<?php

namespace App\Controller\API;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class ApiAuthController extends AbstractController
{
    // Login is handled by JWT

    #[Route('/api/register', name: 'api_register')]
    public function index(Request $request, JWTTokenManagerInterface $JWTManager, UserPasswordHasherInterface $userPasswordHasher): Response
    {
        if (!$request->get('email') || !$request->get('password')) {
            return $this->json([
                'message' => 'Missing e-mail and/or password',
            ],
                Response::HTTP_BAD_REQUEST);
        } else {
            $email = $request->get('email');
            $password = $request->get('password');
        }

        $entityManager = $this->getDoctrine()->getManager();
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if ($existingUser instanceof User) {
            return $this->json([
                'message' => 'User already exists!',
            ]);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPassword(
            $userPasswordHasher->hashPassword(
                $user,
                $password
            )
        );

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'user' => $user->getUserIdentifier(),
            'token' => $JWTManager->create($user),
        ]);
    }
}
